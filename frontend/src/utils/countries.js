// Country name to ISO code mapping
export const countryNameToCode = {
  'Afghanistan': 'AF',
  'Albania': 'AL',
  'Algeria': 'DZ',
  'Argentina': 'AR',
  'Australia': 'AU',
  'Austria': 'AT',
  'Bangladesh': 'BD',
  'Belgium': 'BE',
  'Brazil': 'BR',
  'Canada': 'CA',
  'China': 'CN',
  'Denmark': 'DK',
  'Egypt': 'EG',
  'Finland': 'FI',
  'France': 'FR',
  'Germany': 'DE',
  'India': 'IN',
  'Indonesia': 'ID',
  'Ireland': 'IE',
  'Italy': 'IT',
  'Japan': 'JP',
  'Malaysia': 'MY',
  'Mexico': 'MX',
  'Netherlands': 'NL',
  'New Zealand': 'NZ',
  'Norway': 'NO',
  'Pakistan': 'PK',
  'Philippines': 'PH',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Russia': 'RU',
  'Singapore': 'SG',
  'South Africa': 'ZA',
  'South Korea': 'KR',
  'Spain': 'ES',
  'Sweden': 'SE',
  'Switzerland': 'CH',
  'Thailand': 'TH',
  'Turkey': 'TR',
  'Ukraine': 'UA',
  'United Kingdom': 'GB',
  'United States': 'US',
  'Vietnam': 'VN'
};

// ISO code to country name mapping
export const countryCodeToName = Object.fromEntries(
  Object.entries(countryNameToCode).map(([name, code]) => [code, name])
);

// Function to get country code from name
export const getCountryCode = (countryName) => {
  return countryNameToCode[countryName] || countryName;
};

// Function to get country name from code
export const getCountryName = (countryCode) => {
  return countryCodeToName[countryCode] || countryCode;
};

// List of countries with codes for dropdowns
export const countryOptions = Object.entries(countryNameToCode).map(([name, code]) => ({
  label: name,
  value: code,
  displayValue: `${name} (${code})`
}));
