# QwikShift iOS App Store Submission Guide

## Phase 1: Apple Developer Program Enrollment (24 hours)

### 1.1 Enroll as Apple Developer
- Visit https://developer.apple.com/enroll/
- - Create Apple ID (if needed)
  - - Complete enrollment: $99/year
    - - Accept developer agreement
     
      - ### 1.2 Setup Your Team
      - - Log in to https://appstoreconnect.apple.com/
        - - Create team (if first time)
          - - Assign user roles (Admin, Developer, Marketer, Finance)
            - - Enable 2FA on Apple ID
             
              - ## Phase 2: Certificates & Provisioning Profiles (1-2 hours)
             
              - ### 2.1 Create App ID
              - ```bash
                # In Xcode: Preferences > Accounts > Manage Certificates
                # Or via https://developer.apple.com/account/resources/
                # Bundle ID: com.qwikshift.app
                ```

                ### 2.2 Generate iOS Distribution Certificate
                - Certificates, Identifiers & Profiles
                - - Certificates tab > Create new certificate
                  - - Select "Apple Distribution" (App Store)
                    - - Upload CSR (Certificate Signing Request from Xcode)
                      - - Download .cer file
                        - - Double-click to add to Keychain
                         
                          - ### 2.3 Create App Store Provisioning Profile
                          - - Provisioning Profiles > Create new
                            - - Select "App Store"
                              - - Select com.qwikshift.app
                                - - Select distribution certificate
                                  - - Download .mobileprovision file
                                   
                                    - ## Phase 3: Xcode Configuration (1-2 hours)
                                   
                                    - ### 3.1 Open Xcode Project
                                    - ```bash
                                      cd ios
                                      open QwikShift.xcworkspace
                                      ```

                                      ### 3.2 Configure Signing & Capabilities
                                      - Select QwikShift project
                                      - - Select QwikShift target
                                        - - Signing & Capabilities tab:
                                          -   - Team: Select your team
                                              -   - Bundle Identifier: com.qwikshift.app
                                                  -   - Minimum Deployment: iOS 14.0+
                                                   
                                                      - ### 3.3 Add Required Capabilities
                                                      - - + Capability button:
                                                          +   - Background Modes (Location Updates)
                                                              -   - Push Notifications
                                                                  -   - Maps (for job location display)
                                                                      -   - Sign In with Apple (payment feature)
                                                                       
                                                                          - ### 3.4 Prepare App Icons (1024x1024 PNG)
                                                                          - ```bash
                                                                            # Assets.xcassets > AppIcon
                                                                            # Upload 1024x1024 PNG (transparent background, no text)
                                                                            # Xcode auto-generates all sizes
                                                                            ```

                                                                            ### 3.5 Add Launch Screen
                                                                            - Main.storyboard or LaunchScreen.storyboard
                                                                            - - Add app logo
                                                                              - - Add "Connecting you with event staff..."
                                                                               
                                                                                - ## Phase 4: Build Release Version (1 hour)
                                                                               
                                                                                - ### 4.1 Update Version & Build Number
                                                                                - ```bash
                                                                                  # General > Version: 1.0.0
                                                                                  # General > Build: 1
                                                                                  ```

                                                                                  ### 4.2 Create Archive
                                                                                  ```bash
                                                                                  # Product > Archive
                                                                                  # Wait for "Ready to distribute" message
                                                                                  # Window > Organizer > Archives
                                                                                  ```

                                                                                  ### 4.3 Distribute via App Store Connect
                                                                                  - Select archive > Distribute App
                                                                                  - - App Store Connect > Upload
                                                                                    - - Choose team
                                                                                      - - Manage version/build number
                                                                                        - - Upload to App Store Connect
                                                                                         
                                                                                          - ## Phase 5: App Store Connect Listing (2-3 hours)
                                                                                         
                                                                                          - ### 5.1 Create New App
                                                                                          - - https://appstoreconnect.apple.com/
                                                                                            - - My Apps > + button
                                                                                              - - Platform: iOS
                                                                                                - - Name: QwikShift
                                                                                                  - - Bundle ID: com.qwikshift.app
                                                                                                    - - SKU: qwikshift-v1
                                                                                                     
                                                                                                      - ### 5.2 App Information
                                                                                                      - - Category: Business
                                                                                                        - - Subcategory: Productivity
                                                                                                          - - Content Rights: Self-created
                                                                                                            - - Age Rating: 4+
                                                                                                              - - In-App Purchases: Not yet
                                                                                                               
                                                                                                                - ### 5.3 Pricing & Availability
                                                                                                                - - Price: Free
                                                                                                                  - - Availability: Worldwide (or select countries)
                                                                                                                    - - First Release Date: Today's date
                                                                                                                     
                                                                                                                      - ### 5.4 General App Information
                                                                                                                      - **Subtitle (30 chars max):**
                                                                                                                      - "Find Event Staff in 24 Hours"
                                                                                                                     
                                                                                                                      - **Promotional Text (170 chars max):**
                                                                                                                      - "Post jobs, get applications, hire verified staff. 10% commission, 24-hour turnaround."
                                                                                                                     
                                                                                                                      - **Description (4,000 chars max):**
                                                                                                                      - ```
                                                                                                                        QwikShift is the fastest way to find and hire event staff.

                                                                                                                        KEY FEATURES:
                                                                                                                        ✓ Post event jobs in minutes
                                                                                                                        ✓ Get qualified applications within 24 hours
                                                                                                                        ✓ Save 40-60% with only 10% commission
                                                                                                                        ✓ Verified worker profiles with ratings
                                                                                                                        ✓ Real-time location-based matching
                                                                                                                        ✓ Secure payment processing
                                                                                                                        ✓ Dispute resolution & protection

                                                                                                                        HOW IT WORKS:
                                                                                                                        1. Post your event job (bartenders, waitstaff, security, etc.)
                                                                                                                        2. Receive applications from verified workers within 24 hours
                                                                                                                        3. Review profiles, ratings, and experience
                                                                                                                        4. Hire and pay through our secure platform
                                                                                                                        5. Get notifications when jobs are completed

                                                                                                                        WORKER BENEFITS:
                                                                                                                        • Find local event gigs in your area
                                                                                                                        • Get paid directly to your account
                                                                                                                        • Work flexible hours
                                                                                                                        • Build your professional rating

                                                                                                                        SECURITY & TRUST:
                                                                                                                        • Multi-factor authentication
                                                                                                                        • Encrypted payments
                                                                                                                        • Identity verification
                                                                                                                        • Dispute resolution support
                                                                                                                        • Secure chat with workers

                                                                                                                        SUPPORTED EVENTS:
                                                                                                                        Weddings, Corporate Events, Conferences, Festivals, Concerts, Private Parties, Galas, Banquets

                                                                                                                        Terms: https://qwikshift.app/terms
                                                                                                                        Privacy: https://qwikshift.app/privacy
                                                                                                                        Support: support@qwikshift.app
                                                                                                                        ```
                                                                                                                        
                                                                                                                        **Keywords (100 chars max, comma-separated):**
                                                                                                                        "event staffing, job search, gig work, event jobs, hiring, temporary staff, hospitality"
                                                                                                                        
                                                                                                                        **Support URL:**
                                                                                                                        https://qwikshift.app/support
                                                                                                                        
                                                                                                                        **Privacy Policy URL:**
                                                                                                                        https://qwikshift.app/privacy
                                                                                                                        
                                                                                                                        **Marketing URL (optional):**
                                                                                                                        https://qwikshift.app
                                                                                                                        
                                                                                                                        ## Phase 6: Screenshots (30-45 mins per size)
                                                                                                                        
                                                                                                                        ### 6.1 Required Screenshot Sizes
                                                                                                                        - iPhone 6.7" (2796 x 1290 px)
                                                                                                                        - - iPhone 6.1" (2556 x 1179 px)
                                                                                                                          - - iPad 12.9" (2048 x 2732 px)
                                                                                                                           
                                                                                                                            - ### 6.2 Recommended Screenshots (5 per device size)
                                                                                                                           
                                                                                                                            - **Screenshot 1: Main Job Listing**
                                                                                                                            - - Title: "Find Event Jobs Near You"
                                                                                                                              - - Show: Map view with job pins, job cards below
                                                                                                                                - - Highlight: "24-hour turnaround" badge
                                                                                                                                 
                                                                                                                                  - **Screenshot 2: Job Details**
                                                                                                                                  - - Title: "Review Job & Apply in Minutes"
                                                                                                                                    - - Show: Job details, requirements, pay rate
                                                                                                                                      - - Highlight: Apply button, worker rating display
                                                                                                                                       
                                                                                                                                        - **Screenshot 3: Worker Profile**
                                                                                                                                        - - Title: "Verified & Rated Workers"
                                                                                                                                          - - Show: Worker profile card, ratings, experience
                                                                                                                                            - - Highlight: Badge "Verified ID", 4.9 stars
                                                                                                                                             
                                                                                                                                              - **Screenshot 4: Payment Security**
                                                                                                                                              - - Title: "Secure Payment Processing"
                                                                                                                                              - Show: Payment confirmation, escrow protection
                                                                                                                                              - - Highlight: Lock icon, "Funds held until job complete"
                                                                                                                                               
                                                                                                                                                - **Screenshot 5: Dispute Resolution**
                                                                                                                                                - - Title: "Protected by QwikShift Guarantee"
                                                                                                                                                  - - Show: Dispute resolution interface
                                                                                                                                                    - - Highlight: "We got your back" messaging
                                                                                                                                                     
                                                                                                                                                      - ### 6.3 Upload Screenshots
                                                                                                                                                      - - App Store Connect > iOS > Localizable Screenshots
                                                                                                                                                        - - Language: English
                                                                                                                                                          - - Device: iPhone 6.7" (upload first)
                                                                                                                                                            - - Add 5 screenshots in order
                                                                                                                                                              - - Repeat for other device sizes
                                                                                                                                                               
                                                                                                                                                                - ## Phase 7: Preview & Test Information (30 mins)
                                                                                                                                                               
                                                                                                                                                                - ### 7.1 Demo Account Details
                                                                                                                                                                - ```
                                                                                                                                                                  Demo Account for Reviewers:
                                                                                                                                                                  Email: demo@qwikshift.app
                                                                                                                                                                  Password: QwikShiftDemo2024!
                                                                                                                                                                  Test Phone: +1-555-0100
                                                                                                                                                                  Test Credit Card: 4111 1111 1111 1111 (exp: 12/25, CVC: 123)
                                                                                                                                                                  ```
                                                                                                                                                                  
                                                                                                                                                                  ### 7.2 Notes for App Review
                                                                                                                                                                  ```
                                                                                                                                                                  Thank you for reviewing QwikShift!

                                                                                                                                                                  OVERVIEW:
                                                                                                                                                                  QwikShift is an event staffing marketplace. Employers post jobs, workers apply, and we handle secure payments and verification.

                                                                                                                                                                  FEATURES DEMONSTRATED:
                                                                                                                                                                  1. Job posting and browsing (uses real location services)
                                                                                                                                                                  2. Application submission with worker verification
                                                                                                                                                                  3. Secure payment processing (test mode)
                                                                                                                                                                  4. Dispute resolution workflow
                                                                                                                                                                  5. Real-time notifications

                                                                                                                                                                  HOW TO TEST:
                                                                                                                                                                  1. Log in with demo account above
                                                                                                                                                                  2. Browse jobs on the map (no location needed, uses test coords)
                                                                                                                                                                  3. Submit application to any test job
                                                                                                                                                                  4. Check notifications for acceptance
                                                                                                                                                                  5. Complete payment flow (use test card above)

                                                                                                                                                                  KEY POINTS:
                                                                                                                                                                  - Multi-factor auth enabled (SMS to +1-555-0100)
                                                                                                                                                                  - All payments in test/sandbox mode
                                                                                                                                                                  - No real money exchanged
                                                                                                                                                                  - All user data encrypted
                                                                                                                                                                  - Complies with App Store guidelines
                                                                                                                                                                  
                                                                                                                                                                  DEMO JOB:
                                                                                                                                                                  Title: "Bartenders Needed - Saturday Night"
                                                                                                                                                                  Location: San Francisco, CA
                                                                                                                                                                  Pay: $25/hour + tips
                                                                                                                                                                  Status: Open for applications
                                                                                                                                                                  ```
                                                                                                                                                                  
                                                                                                                                                                  ## Phase 8: Content Rating Questionnaire (15 mins)
                                                                                                                                                                  
                                                                                                                                                                  ### 8.1 Complete Rating Form
                                                                                                                                                                  - Gambling: None
                                                                                                                                                                  - - Alcohol, Tobacco, Drugs: None
                                                                                                                                                                    - - Profanity or Crude Humor: None
                                                                                                                                                                      - - Medical Information: None
                                                                                                                                                                        - - Violence: None
                                                                                                                                                                          - - Horror or Scary Themes: None
                                                                                                                                                                            - - Sexual Content: None
                                                                                                                                                                              - - Graphic Sexual Content: None
                                                                                                                                                                              
                                                                                                                                                                              ### 8.2 Expected Rating
                                                                                                                                                                              - **Age Rating: 4+**
                                                                                                                                                                              - - No content violations
                                                                                                                                                                                - - Safe for all ages
                                                                                                                                                                                 
                                                                                                                                                                                  - ## Phase 9: Submission & Review (24-48 hours)
                                                                                                                                                                                 
                                                                                                                                                                                  - ### 9.1 Final Review Checklist
                                                                                                                                                                                  - - [ ] All metadata complete and accurate
                                                                                                                                                                                    - [ ] - [ ] 5+ screenshots per device size
                                                                                                                                                                                    - [ ] - [ ] Demo account working
                                                                                                                                                                                    - [ ] - [ ] Privacy policy published
                                                                                                                                                                                    - [ ] - [ ] No broken links
                                                                                                                                                                                    - [ ] - [ ] App icon compliant
                                                                                                                                                                                    - [ ] - [ ] No sensitive data in app
                                                                                                                                                                                    - [ ] - [ ] No external payment systems (Apple Pay only)
                                                                                                                                                                                    - [ ] - [ ] Background location permission justified
                                                                                                                                                                                    - [ ] All analytics configured
                                                                                                                                                                                    - [ ] 
                                                                                                                                                                                    ### 9.2 Submit for Review
                                                                                                                                                                                    - App Store Connect > Prepare for Submission
                                                                                                                                                                                    - - Build: Select latest
                                                                                                                                                                                      - - Check "Ready to Submit"
                                                                                                                                                                                        - - App Review Information: Complete
                                                                                                                                                                                          - - Age Rating: 4+
                                                                                                                                                                                            - - Encryption: Complete
                                                                                                                                                                                              - - Submit for Review button
                                                                                                                                                                                               
                                                                                                                                                                                                - ### 9.3 Review Timeline
                                                                                                                                                                                                - - **Processing**: 24-48 hours typical
                                                                                                                                                                                                  - - **Possible Outcomes**:
                                                                                                                                                                                                    -   - ✅ Approved → App live on App Store
                                                                                                                                                                                                        -   - ⏳ Needs Updates → Fix and resubmit
                                                                                                                                                                                                            -   - ❌ Rejected → Review feedback, address issues
                                                                                                                                                                                                             
                                                                                                                                                                                                                - ### 9.4 Common Rejection Reasons & Fixes
                                                                                                                                                                                                                - | Issue | Solution |
                                                                                                                                                                                                                |-------|----------|
                                                   
| External payment links | Remove, use Apple Pay only || Unclear job matching | Add more demo screenshots |
| Missing privacy policy | Add public privacy URL |
| Location always-on | Justify with "While You Work" mode |
| Test data visible | Clean demo accounts |

## Phase 10: Post-Approval (1 week)

### 10.1 Marketing Launch
- Email announcement
- - Social media posts
  - - Website download badge
    - - Press release (optional)
     
      - ### 10.2 Monitor App Store
      - - Reviews & ratings
        - - Crash reports
          - - Performance metrics
            - - User feedback
             
              - ### 10.3 Support Resources
              - - In-app help system
                - - FAQ on website
                  - - Support email: support@qwikshift.app
                    - - Priority: Fix critical bugs within 24 hours
                     
                      - ## Quick Reference: Build Commands
                     
                      - ```bash
                        # Install dependencies
                        cd ios && pod install && cd ..

                        # Build for testing
                        xcodebuild -workspace ios/QwikShift.xcworkspace \
                          -scheme QwikShift \
                          -configuration Debug \
                          -destination 'platform=iOS Simulator,name=iPhone 15'

                        # Build for App Store (requires certificates)
                        xcodebuild -workspace ios/QwikShift.xcworkspace \
                          -scheme QwikShift \
                          -configuration Release \
                          -destination generic/platform=iOS \
                          -archivePath build/QwikShift.xcarchive \
                          archive

                        # Export for App Store
                        xcodebuild -exportArchive \
                          -archivePath build/QwikShift.xcarchive \
                          -exportOptionsPlist ExportOptions.plist \
                          -exportPath build/export
                        ```

                        ## Contact & Support
                        - **Developer Email:** your-email@qwikshift.app
                        - - **Support Email:** support@qwikshift.app
                          - - **Website:** https://qwikshift.app
                            - - **Status Page:** https://status.qwikshift.app
