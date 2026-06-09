# Testing Country Selection Feature

## Quick Start

### 1. Open the Signup Page
```
http://localhost:3000/auth/signup-seller
```

### 2. Test Seller Flow
1. **Click "I'm a Seller"** → Continue
2. **Fill in basic info:**
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com

3. **NEW: Select Country**
   - Click the "Country/Region" dropdown
   - You'll see all 11 supported countries sorted alphabetically
   - Default: Canada is selected

4. **NEW: See Phone Format**
   - When you select a country, a format hint appears above the phone field
   - Example for Canada: "Format: +1 (555) 123-4456"
   - Example for UAE: "Format: +971 50 123 4567"

5. **Enter Phone Number**
   - For Canada: Try "+1 (555) 123-4567"
   - For UAE: Try "+971 50 123 4567"
   - For Egypt: Try "+20 100 123 4567"

6. **Click Next**
   - If phone format matches country → ✅ Proceed to next step
   - If phone format doesn't match → ❌ Error with example format

---

## Test Cases

### ✅ Valid Phone Numbers

**United States/Canada:**
```
+1 (555) 123-4456    ✓ Parentheses format
555-123-4456         ✓ Dashes only
(555) 123-4567       ✓ Without +1 prefix
5551234567           ✓ Digits only
```

**UAE/Saudi Arabia:**
```
+971 50 123 4567     ✓ With prefix and spaces
+97150 1234567       ✓ With prefix, no spaces
971501234567         ✓ Without + symbol
```

**Egypt:**
```
+20 100 123 4567     ✓ Full format
201001234567         ✓ Without prefix
+20 1001234567       ✓ Flexible spacing
```

**UK:**
```
+44 20 7946 0958     ✓ London area code
+44 7700 900000      ✓ Mobile numbers
```

**Australia:**
```
+61 2 1234 5678      ✓ Sydney area
+61412345678         ✓ Without spaces
```

### ❌ Invalid Phone Numbers

```
123456               ✗ Too short
abcdefghij           ✗ Non-numeric
555-1234567          ✗ Wrong format for country
+1 (555) 123        ✗ Incomplete
+971 123 456         ✗ Wrong digit count for UAE
```

### 🔄 Cross-Country Rejection

```
+1 (555) 123-4567 with UAE selected     ✗ Rejected
+971 50 123 4567 with Canada selected   ✗ Rejected
+20 100 123 4567 with US selected       ✗ Rejected
```

---

## Test Broker Flow

1. **Click "I'm a Broker"** → Continue
2. **Step 1: Broker Verification**
   - Fill broker details (name, email, company, license)
   - **NEW:** Select country from dropdown
   - **NEW:** See phone format for selected country
   - Enter broker's phone number
   - Click Next

3. **Step 3: Seller Information**
   - **NEW:** Country dropdown for seller
   - **NEW:** Phone format display for seller's country
   - Fill in seller's phone number

---

## Visual Verification

### Country Dropdown
- [ ] Appears below email field
- [ ] Shows all 11 countries in alphabetical order
- [ ] Default: Canada is selected
- [ ] Each country shows name and area code (e.g., "Canada (+1)")

### Phone Format Display
- [ ] Appears only when country is selected
- [ ] Shows orange box with "Format: " label
- [ ] Updates when you change country
- [ ] Example: "Format: +971 50 123 4567" for UAE

### Phone Input Field
- [ ] Placeholder changes based on country
- [ ] Error message includes example format if validation fails
- [ ] Example error: "Please enter a valid phone number (e.g., +971 50 123 4567)"

---

## Database Verification

After submitting a seller form:

```bash
# Connect to PostgreSQL
psql forward_os

# Check seller was created with country
SELECT id, first_name, last_name, email, country, phone_number 
FROM seller_identity 
ORDER BY created_at DESC 
LIMIT 1;
```

Expected output:
```
 id  | first_name | last_name | email         | country | phone_number
-----+------------+-----------+---------------+---------+------------------
 123 | John       | Doe       | john@test.com | AE      | +971 50 123 4567
```

---

## Debugging

### Issue: Dropdown not showing?
1. Check browser console for JavaScript errors
2. Verify `/src/lib/countries.ts` exists
3. Verify SellerKYCUploadWizard.tsx imports countries service
4. Restart dev server: `npm run dev`

### Issue: Phone validation always fails?
1. Check error message includes example format
2. Try exact example format shown
3. Make sure country is selected (not empty)
4. Check browser console for validation logs

### Issue: Dev server not running?
```bash
cd /Users/test/ForwardOS
npm run dev
# Should start on http://localhost:3000
```

---

## Performance Testing

The feature should perform instantly:

- [ ] Country dropdown opens in < 100ms
- [ ] Format display updates when you select country (< 50ms)
- [ ] Phone validation runs in real-time (< 1ms)
- [ ] Form submission takes < 1 second
- [ ] No console errors or warnings

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab to reach country dropdown
- [ ] Arrow keys navigate through countries
- [ ] Enter selects country
- [ ] Tab moves to phone field
- [ ] Form can be completed with keyboard only

### Screen Reader Testing
- [ ] Dropdown labeled as "Country/Region *"
- [ ] Phone field labeled as "Phone Number *"
- [ ] Required fields marked with asterisk
- [ ] Error messages read by screen reader
- [ ] Format hint visible to screen readers

### Mobile Testing
```
http://localhost:3000/auth/signup-seller
```
- [ ] Dropdown is touch-friendly
- [ ] Phone format display is readable
- [ ] Error messages are visible
- [ ] No horizontal scrolling
- [ ] Input field is appropriately sized

---

## Browser Compatibility

Test in multiple browsers:

- [ ] Chrome/Edge (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)

All should work identically.

---

## Success Criteria

✅ **Feature is working correctly if:**
1. Country dropdown shows all 11 countries
2. Phone format displays when country is selected
3. Phone validation matches selected country's format
4. Validation errors include example format
5. Form submission saves country code to database
6. All 11 countries work correctly
7. Cross-country validation rejects invalid formats
8. No console errors or warnings
9. Feature works on mobile and desktop
10. Accessibility features (keyboard, screen reader) work

---

**Last Tested:** June 9, 2024  
**Dev Server:** http://localhost:3000  
**Current Status:** ✅ Working
