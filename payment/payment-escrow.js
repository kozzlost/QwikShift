/**
 * Payment Escrow System - QwikShift
 * @module payment/payment-escrow
 */

const crypto = require('crypto');

class EscrowManager {
    constructor() {
          this.escrows = new Map();
          this.statuses = { PENDING: 'pending', HELD: 'held', RELEASED: 'released', DISPUTED: 'disputed', REFUNDED: 'refunded' };
    }

  createEscrow(hireId, jobData) {
        const id = crypto.randomUUID();
        const workerRate = jobData.rate;
        const commissionRate = jobData.commissionRate;
        const platformFee = workerRate * commissionRate;
        const employerTotal = workerRate + platformFee;

      const escrow = {
              id, hireId, createdAt: new Date(), releasedAt: null,
              workerRate, platformFee, employerTotal, commissionRate,
              status: this.statuses.PENDING,
              holdType: jobData.holdType || 'hire', // 'hire' or 'completion'
              releaseConditions: { jobCompleted: false, disputeResolved: true, daysPassed: 0 },
              transactions: []
      };
        this.escrows.set(id, escrow);
        return escrow;
  }

  holdFunds(escrowId) {
        const e = this.escrows.get(escrowId);
        if (!e) throw new Error('Escrow not found');
        e.status = this.statuses.HELD;
        e.transactions.push({ type: 'HOLD', amount: e.employerTotal, at: new Date() });
        return e;
  }

  markJobComplete(escrowId) {
        const e = this.escrows.get(escrowId);
        if (e) e.releaseConditions.jobCompleted = true;
        return e;
  }

  releaseFunds(escrowId) {
        const e = this.escrows.get(escrowId);
        if (!e || e.status === this.statuses.RELEASED) throw new Error('Cannot release');
        if (e.holdType === 'completion' && !e.releaseConditions.jobCompleted) throw new Error('Job not complete');

      e.status = this.statuses.RELEASED;
        e.releasedAt = new Date();
        e.transactions.push({ type: 'RELEASE', workerAmount: e.workerRate, platformAmount: e.platformFee, at: new Date() });
        return e;
  }

  refundEscrow(escrowId, reason) {
        const e = this.escrows.get(escrowId);
        if (!e) throw new Error('Escrow not found');
        e.status = this.statuses.REFUNDED;
        e.refundReason = reason;
        e.transactions.push({ type: 'REFUND', amount: e.employerTotal, reason, at: new Date() });
        return e;
  }

  disputeEscrow(escrowId, disputeId) {
        const e = this.escrows.get(escrowId);
        if (e) { e.status = this.statuses.DISPUTED; e.linkedDisputeId = disputeId; }
        return e;
  }

  getEscrow(escrowId) { return this.escrows.get(escrowId); }
    getByHire(hireId) { return Array.from(this.escrows.values()).find(e => e.hireId === hireId); }
    getTransaction(escrowId) { const e = this.escrows.get(escrowId); return e?.transactions || []; }
}

class FundsTracker {
    constructor() {
          this.balances = new Map(); // employerId -> balance
      this.pending = new Map(); // escrowId -> amount
    }

  addPending(escrowId, amount) {
        this.pending.set(escrowId, amount);
  }

  releasePending(escrowId, employerId) {
        const amt = this.pending.get(escrowId);
        if (!amt) return 0;
        const cur = this.balances.get(employerId) || 0;
        this.balances.set(employerId, cur - amt);
        this.pending.delete(escrowId);
        return amt;
  }

  depositWorkerEarnings(workerId, amount) {
        const cur = this.balances.get(workerId) || 0;
        this.balances.set(workerId, cur + amount);
  }

  getBalance(userId) { return this.balances.get(userId) || 0; }
    getPending(escrowId) { return this.pending.get(escrowId) || 0; }
    getPendingTotal(userId) {
          let total = 0;
          this.pending.forEach(v => total += v);
          return total;
    }
}

class ReleaseConditions {
    constructor() { this.rules = new Map(); }

  setRule(escrowId, condition, value) {
        let rule = this.rules.get(escrowId) || {};
        rule[condition] = value;
        this.rules.set(escrowId, rule);
        return rule;
  }

  canRelease(escrowId, escrow) {
        const rule = this.rules.get(escrowId) || {};
        if (rule.requireJobComplete && !escrow.releaseConditions.jobCompleted) return false;
        if (rule.requireDisputeResolved && !escrow.releaseConditions.disputeResolved) return false;
        if (rule.minDaysHeld) {
                const held = (new Date() - escrow.createdAt) / (1000 * 60 * 60 * 24);
                if (held < rule.minDaysHeld) return false;
        }
        return true;
  }

  getRule(escrowId) { return this.rules.get(escrowId); }
}

class EscrowReporting {
    constructor(escrowMgr, fundsTracker) {
          this.escrowMgr = escrowMgr;
          this.fundsTracker = fundsTracker;
    }

  getEmployerStatement(employerId) {
        const escrows = Array.from(this.escrowMgr.escrows.values());
        const total = escrows.reduce((s, e) => s + (e.status === 'held' ? e.employerTotal : 0), 0);
        const released = escrows.reduce((s, e) => s + (e.status === 'released' ? e.employerTotal : 0), 0);
        return {
                employerId, totalHeld: total, totalReleased: released,
                balance: this.fundsTracker.getBalance(employerId), pending: this.fundsTracker.getPendingTotal(employerId)
        };
  }

  getWorkerEarnings(workerId) {
        const escrows = Array.from(this.escrowMgr.escrows.values());
        const earned = escrows.reduce((s, e) => s + (e.status === 'released' ? e.workerRate : 0), 0);
        return { workerId, totalEarned: earned, balance: this.fundsTracker.getBalance(workerId) };
  }

  reconcile() {
        const summary = { totalHeld: 0, totalPending: 0, totalDisputed: 0 };
        this.escrowMgr.escrows.forEach(e => {
                if (e.status === 'held') summary.totalHeld += e.employerTotal;
                if (e.status === 'pending') summary.totalPending += e.employerTotal;
                if (e.status === 'disputed') summary.totalDisputed += e.employerTotal;
        });
        return summary;
  }
}

module.exports = { EscrowManager, FundsTracker, ReleaseConditions, EscrowReporting };
