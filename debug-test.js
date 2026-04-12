// Simple test to debug the API endpoint
const testData = {
  clientId: '89016332-33f7-4a33-bc39-bd79e30aa1c8',
  areaCode: '555'
};

console.log('Testing with data:', testData);
console.log('userId:', testData.userId);
console.log('clientId:', testData.clientId);
console.log('targetUserId:', testData.userId || testData.clientId);
console.log('areaCode:', testData.areaCode);

const targetUserId = testData.userId || testData.clientId;
if (!targetUserId || !testData.areaCode) {
  console.log('❌ Validation failed');
} else {
  console.log('✅ Validation passed');
}