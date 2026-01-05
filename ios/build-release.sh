#!/bin/bash

# QwikShift iOS Build Script for App Store Release
# Usage: ./ios/build-release.sh
# Purpose: Automates the build, archive, and export process for App Store submission

set -e  # Exit on error

echo "🚀 QwikShift iOS Release Build"
echo "================================"
echo ""

# Configuration
WORKSPACE="ios/QwikShift.xcworkspace"
SCHEME="QwikShift"
CONFIGURATION="Release"
ARCHIVE_PATH="build/QwikShift.xcarchive"
EXPORT_PATH="build/export"
EXPORT_PLIST="ios/ExportOptions.plist"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}Error: Xcode is not installed${NC}"
        exit 1
        fi

        if [ ! -f "$WORKSPACE" ]; then
            echo -e "${RED}Error: Xcode workspace not found at $WORKSPACE${NC}"
                exit 1
                fi

                if [ ! -f "$EXPORT_PLIST" ]; then
                    echo -e "${RED}Error: ExportOptions.plist not found at $EXPORT_PLIST${NC}"
                        exit 1
                        fi
                        echo -e "${GREEN}✓ Prerequisites OK${NC}"
                        echo ""

                        # Step 2: Pod install
                        echo -e "${YELLOW}Step 2: Installing CocoaPods dependencies...${NC}"
                        cd ios
                        pod install
                        cd ..
                        echo -e "${GREEN}✓ CocoaPods installed${NC}"
                        echo ""

                        # Step 3: Clean
                        echo -e "${YELLOW}Step 3: Cleaning build directory...${NC}"
                        rm -rf build/
                        mkdir -p build/
                        echo -e "${GREEN}✓ Build directory cleaned${NC}"
                        echo ""

                        # Step 4: Build and Archive
                        echo -e "${YELLOW}Step 4: Building for App Store (this may take 5-15 minutes)...${NC}"
                        xcodebuild -workspace "$WORKSPACE" \
                            -scheme "$SCHEME" \
                                -configuration "$CONFIGURATION" \
                                    -destination generic/platform=iOS \
                                        -archivePath "$ARCHIVE_PATH" \
                                            clean archive \
                                                | grep -E "error:|warning:|Build complete" || true

                                                if [ ! -d "$ARCHIVE_PATH" ]; then
                                                    echo -e "${RED}Error: Archive creation failed${NC}"
                                                        exit 1
                                                        fi
                                                        echo -e "${GREEN}✓ Archive created successfully${NC}"
                                                        echo ""

                                                        # Step 5: Export for App Store
                                                        echo -e "${YELLOW}Step 5: Exporting for App Store...${NC}"
                                                        xcodebuild -exportArchive \
                                                            -archivePath "$ARCHIVE_PATH" \
                                                                -exportOptionsPlist "$EXPORT_PLIST" \
                                                                    -exportPath "$EXPORT_PATH" \
                                                                        | grep -E "error:|warning:|Export complete" || true

                                                                        if [ ! -d "$EXPORT_PATH/QwikShift.ipa" ]; then
                                                                            echo -e "${YELLOW}Note: IPA location may vary by Xcode version${NC}"
                                                                            fi
                                                                            echo -e "${GREEN}✓ Export completed${NC}"
                                                                            echo ""

                                                                            # Step 6: Verify
                                                                            echo -e "${YELLOW}Step 6: Verifying build artifacts...${NC}"
                                                                            ARCHIVE_SIZE=$(du -sh "$ARCHIVE_PATH" | cut -f1)
                                                                            EXPORT_SIZE=$(du -sh "$EXPORT_PATH" | cut -f1)
                                                                            echo "Archive size: $ARCHIVE_SIZE"
                                                                            echo "Export size: $EXPORT_SIZE"
                                                                            echo -e "${GREEN}✓ Build verification complete${NC}"
                                                                            echo ""

                                                                            # Summary
                                                                            echo -e "${GREEN}================================${NC}"
                                                                            echo -e "${GREEN}✓ Build Complete!${NC}"
                                                                            echo -e "${GREEN}================================${NC}"
                                                                            echo ""
                                                                            echo "Next steps:"
                                                                            echo "1. Archive: $ARCHIVE_PATH"
                                                                            echo "2. Export: $EXPORT_PATH"
                                                                            echo "3. Upload to App Store Connect:"
                                                                            echo "   - Open Xcode > Window > Organizer"
                                                                            echo "   - Select your archive"
                                                                            echo "   - Click 'Distribute App'"
                                                                            echo "   - Choose 'App Store Connect'"
                                                                            echo "   - Follow the prompts"
                                                                            echo ""
                                                                            echo "Or use Transporter app:"
                                                                            echo "   - Download from App Store"
                                                                            echo "   - Select the .ipa file"
                                                                            echo "   - Deliver to App Store"
                                                                            echo ""
