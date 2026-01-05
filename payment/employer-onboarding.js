/**
 * Employer Onboarding - QwikShift
 * @module payment/employer-onboarding
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

class EmployerVerification {
    constructor() {
          this.verifications = new Map();
          this.statuses = { PENDING: 'pending', VERIFIED: 'verified', REJECTED: 'rejected', FLAGGED: 'flagged' };
    }

  async verifyBusiness(data) {
        const id = crypto.randomUUID();
        const rec = {
                id, userId: data.userId, businessName: data.businessName, ein: data.ein,
                businessType: data.type, address: data.address, status: this.statuses.PENDING,
                submittedAt: new Date(), documents: data.documents || [], riskScore: 0
        };
        this.verifications.set(id, rec);
        return { verificationId: id, status: rec.status };
  }

  verify(id) { const r = this.verifications.get(id); if (r) r.status = this.statuses.VERIFIED; return r; }
    reject(id, reason) { const r = this.verifications.get(id); if (r) { r.status = this.statuses.REJECTED; r.reason = reason; } return r; }
    getStatus(id) { return this.verifications.get(id); }
}

class PaymentMethodManager {
    constructor() { this.methods = new Map(); this.defaults = new Map(); }

  async addCard(employerId, cardData) {
        try {
                const token = await stripe.tokens.create({ card: { number: cardData.number, exp_month: cardData.expMonth, exp_year: cardData.expYear, cvc: cardData.cvc } });
                const pm = await stripe.paymentMethods.create({ type: 'card', card: { token: token.id } });
                const rec = { id: pm.id, employerId, type: 'card', last4: cardData.number.slice(-4), brand: pm.card.brand, createdAt: new Date(), isDefault: false };
                this.methods.set(pm.id, rec);
                return rec;
        } catch (e) { throw new Error('Card declined: ' + e.message); }
  }

  async addBank(employerId, bankData) {
        const token = await stripe.tokens.create({ bank_account: { country: 'US', currency: 'usd', account_holder_name: bankData.holderName, account_holder_type: bankData.type, routing_number: bankData.routing, account_number: bankData.account } });
        const rec = { id: token.bank_account.id, employerId, type: 'bank', last4: bankData.account.slice(-4), bank: bankData.bankName, createdAt: new Date(), verified: false };
        this.methods.set(rec.id, rec);
        return rec;
  }

  setDefault(employerId, methodId) {
        const prev = Array.from(this.methods.values()).find(m => m.employerId === employerId && m.isDefault);
        if (prev) prev.isDefault = false;
        const m = this.methods.get(methodId);
        if (m) m.isDefault = true;
        return m;
  }

  getMethods(employerId) { return Array.from(this.methods.values()).filter(m => m.employerId === employerId); }
    getDefault(employerId) { return Array.from(this.methods.values()).find(m => m.employerId === employerId && m.isDefault); }
}

class CommissionConfig {
    constructor() { this.configs = new Map(); this.tiers = [{ min: 0, max: 499, rate: 0.30 }, { min: 500, max: 4999, rate: 0.25 }, { min: 5000, max: Infinity, rate: 0.20 }]; }

  getRate(employerId, jobAmount = 0) {
        const custom = this.configs.get(employerId);
        if (custom?.rate) return custom.rate;
        return this.tiers.find(t => jobAmount >= t.min && jobAmount <= t.max)?.rate || 0.20;
  }

  setCustomRate(employerId, rate) {
        if (rate < 0.10 || rate > 0.40) throw new Error('Rate must be 10-40%');
        this.configs.set(employerId, { employerId, rate, setAt: new Date() });
        return this.configs.get(employerId);
  }

  getTaxConfig(employerId) {
        const cfg = this.configs.get(employerId);
        return { employerId, taxId: cfg?.taxId, w9Filed: cfg?.w9Filed || false, businessType: cfg?.businessType };
  }

  setTaxInfo(employerId, data) {
        let cfg = this.configs.get(employerId) || { employerId };
        Object.assign(cfg, { taxId: data.taxId, w9Filed: data.w9Filed, businessType: data.businessType, w9FiledAt: new Date() });
        this.configs.set(employerId, cfg);
        return cfg;
  }
}

class OnboardingWorkflow {
    constructor(verification, paymentMgr, commission) {
          this.verification = verification;
          this.paymentMgr = paymentMgr;
          this.commission = commission;
          this.workflows = new Map();
          this.stages = { INIT: 'init', BIZ_INFO: 'business_info', PAYMENT: 'payment_method', TAX: 'tax_info', COMPLETE: 'complete', REJECTED: 'rejected' };
    }

  startOnboarding(employerId) {
        const wf = { employerId, stage: this.stages.INIT, startedAt: new Date(), completedAt: null, data: {} };
        this.workflows.set(employerId, wf);
        return wf;
  }

  async submitBusinessInfo(employerId, data) {
        const wf = this.workflows.get(employerId);
        if (!wf) throw new Error('No onboarding started');
        const ver = await this.verification.verifyBusiness(data);
        wf.data.businessVerificationId = ver.verificationId;
        wf.stage = this.stages.BIZ_INFO;
        return wf;
  }

  async submitPayment(employerId, data) {
        const wf = this.workflows.get(employerId);
        if (wf.stage !== this.stages.BIZ_INFO) throw new Error('Complete business info first');
        const pm = data.type === 'bank' ? await this.paymentMgr.addBank(employerId, data) : await this.paymentMgr.addCard(employerId, data);
        wf.data.paymentMethodId = pm.id;
        this.paymentMgr.setDefault(employerId, pm.id);
        wf.stage = this.stages.PAYMENT;
        return wf;
  }

  submitTax(employerId, data) {
        const wf = this.workflows.get(employerId);
        if (wf.stage !== this.stages.PAYMENT) throw new Error('Add payment method first');
        this.commission.setTaxInfo(employerId, data);
        wf.data.taxInfo = data;
        wf.stage = this.stages.COMPLETE;
        wf.completedAt = new Date();
        return wf;
  }

  getStatus(employerId) { return this.workflows.get(employerId); }
    getProgress(employerId) {
          const wf = this.workflows.get(employerId);
          const pct = { init: 0, business_info: 33, payment_method: 66, tax_info: 100, complete: 100, rejected: 0 };
          return { stage: wf?.stage, percentage: pct[wf?.stage] || 0 };
    }
}

module.exports = { EmployerVerification, PaymentMethodManager, CommissionConfig, OnboardingWorkflow };
