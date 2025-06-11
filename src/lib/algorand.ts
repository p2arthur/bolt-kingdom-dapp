// Algorand API utilities for fetching kingdom data

interface AlgorandBoxResponse {
  name: string;
  value: string;
}

interface KingdomIdsResponse {
  activeKingdomIds: number[];
}

/**
 * Fetches kingdom IDs from Algorand testnet and decodes them
 * @returns Promise containing array of decoded kingdom IDs
 */
export async function fetchActiveKingdomIds(): Promise<KingdomIdsResponse> {
  try {
    console.log('🔗 Fetching kingdom IDs from Algorand testnet...');
    
    // Make HTTP GET request to Algorand testnet API
    const response = await fetch(
      'https://testnet-idx.4160.nodely.dev/v2/applications/740978143/box?name=b64:a2luZ2RvbXM='
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AlgorandBoxResponse = await response.json();
    console.log('📦 Raw API response:', data);

    if (!data.value) {
      throw new Error('No value field in response');
    }

    // Decode base64 value to byte array
    const base64Value = data.value;
    console.log('🔤 Base64 value:', base64Value);
    
    // Convert base64 to binary string, then to byte array
    const binaryString = atob(base64Value);
    const byteArray = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    
    console.log('📊 Decoded byte array:', byteArray);
    console.log('📏 Byte array length:', byteArray.length);

    // Interpret as sequence of 4-byte unsigned integers (big-endian)
    const activeKingdomIds: number[] = [];
    
    // Process in chunks of 4 bytes
    for (let i = 0; i < byteArray.length; i += 4) {
      if (i + 3 < byteArray.length) {
        // Read 4 bytes as big-endian unsigned 32-bit integer
        const uint32 = (byteArray[i] << 24) | 
                      (byteArray[i + 1] << 16) | 
                      (byteArray[i + 2] << 8) | 
                      byteArray[i + 3];
        
        // Convert to unsigned 32-bit integer
        const kingdomId = uint32 >>> 0;
        activeKingdomIds.push(kingdomId);
        
        console.log(`🏰 Decoded kingdom ID at offset ${i}:`, kingdomId);
      }
    }

    console.log('✅ Successfully decoded kingdom IDs:', activeKingdomIds);
    
    return {
      activeKingdomIds
    };

  } catch (error) {
    console.error('❌ Error fetching kingdom IDs:', error);
    throw error;
  }
}

/**
 * Alternative decoding method using DataView for more precise control
 */
export async function fetchActiveKingdomIdsAlt(): Promise<KingdomIdsResponse> {
  try {
    console.log('🔗 Fetching kingdom IDs from Algorand testnet (alternative method)...');
    
    const response = await fetch(
      'https://testnet-idx.4160.nodely.dev/v2/applications/740978143/box?name=b64:a2luZ2RvbXM='
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AlgorandBoxResponse = await response.json();
    
    if (!data.value) {
      throw new Error('No value field in response');
    }

    // Decode base64 to ArrayBuffer
    const base64Value = data.value;
    const binaryString = atob(base64Value);
    const buffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(buffer);
    
    for (let i = 0; i < binaryString.length; i++) {
      view[i] = binaryString.charCodeAt(i);
    }

    // Use DataView for precise big-endian reading
    const dataView = new DataView(buffer);
    const activeKingdomIds: number[] = [];
    
    // Read 4-byte chunks as big-endian uint32
    for (let offset = 0; offset < buffer.byteLength; offset += 4) {
      if (offset + 4 <= buffer.byteLength) {
        const kingdomId = dataView.getUint32(offset, false); // false = big-endian
        activeKingdomIds.push(kingdomId);
        console.log(`🏰 Decoded kingdom ID at offset ${offset}:`, kingdomId);
      }
    }

    console.log('✅ Successfully decoded kingdom IDs (alt method):', activeKingdomIds);
    
    return {
      activeKingdomIds
    };

  } catch (error) {
    console.error('❌ Error fetching kingdom IDs (alt method):', error);
    throw error;
  }
}