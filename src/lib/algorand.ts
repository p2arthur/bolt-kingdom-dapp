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

    const binary = atob(data.value);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const view = new DataView(buffer);
    const activeKingdomIds: number[] = [];

    let offset = 1; // Skip the type tag or count byte
    while (offset + 8 <= buffer.byteLength) {
      const big = (BigInt(view.getUint32(offset, false)) << 32n) + BigInt(view.getUint32(offset + 4, false));
      activeKingdomIds.push(Number(big)); // If you're sure it's < 2^53
      offset += 8;
    }

    console.log('✅ Correctly decoded kingdom IDs:', activeKingdomIds);
    return { activeKingdomIds };

  } catch (error) {
    console.error('❌ Error decoding kingdom IDs:', error);
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