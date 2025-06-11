// Algorand API utilities for fetching kingdom data

interface AlgorandBoxResponse {
  name: string;
  value: string;
}

interface KingdomIdsResponse {
  activeKingdomIds: number[];
}

interface AlgorandKingdom {
  id: string;
  name: string;
  creator: string;
  description: string;
  fundingProgress: number;
  fundingGoal: string;
  marketCap: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  features: Array<{
    name: string;
    description: string;
  }>;
  isAlgorand?: boolean;
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

/**
 * Converts Algorand kingdom IDs to kingdom objects for display
 */
export function createAlgorandKingdoms(kingdomIds: number[]): AlgorandKingdom[] {
  const kingdomNames = [
    'Algorand Citadel', 'Blockchain Bastion', 'Crypto Castle', 'DeFi Dominion',
    'Smart Contract Stronghold', 'Token Tower', 'Validator Village', 'ASA Archipelago',
    'Consensus Keep', 'Ledger Lands', 'Protocol Palace', 'Network Nexus'
  ];

  const descriptions = [
    'A fortress of decentralized finance built on Algorand',
    'Where smart contracts reign supreme',
    'The epicenter of algorithmic governance',
    'A realm of pure proof-of-stake consensus',
    'Where validators forge the future',
    'The birthplace of Algorand Standard Assets',
    'A kingdom powered by instant finality',
    'Where carbon-negative blockchain thrives'
  ];

  const colorSchemes = [
    { primary: '#00D4AA', secondary: '#00B894', accent: '#00A085' }, // Algorand Green
    { primary: '#0984E3', secondary: '#74B9FF', accent: '#0984E3' }, // Blue
    { primary: '#6C5CE7', secondary: '#A29BFE', accent: '#6C5CE7' }, // Purple
    { primary: '#FD79A8', secondary: '#FDCB6E', accent: '#E84393' }, // Pink-Orange
    { primary: '#00CEC9', secondary: '#55EFC4', accent: '#00B894' }, // Teal
    { primary: '#FF7675', secondary: '#FDCB6E', accent: '#E17055' }, // Red-Orange
  ];

  return kingdomIds.map((id, index) => {
    const colorScheme = colorSchemes[index % colorSchemes.length];
    const nameIndex = index % kingdomNames.length;
    const descIndex = index % descriptions.length;

    return {
      id: `algorand-${id}`,
      name: kingdomNames[nameIndex],
      creator: `0x${id.toString(16).padStart(8, '0').toUpperCase()}`,
      description: descriptions[descIndex],
      fundingProgress: Math.floor(Math.random() * 80) + 20, // 20-100%
      fundingGoal: '$1M ALGO',
      marketCap: `$${(Math.random() * 500 + 100).toFixed(0)}K`,
      primaryColor: colorScheme.primary,
      secondaryColor: colorScheme.secondary,
      accentColor: colorScheme.accent,
      features: [
        { name: 'Algorand Smart Contracts', description: 'Native AVM smart contract integration' },
        { name: 'ASA Support', description: 'Full Algorand Standard Asset compatibility' },
        { name: 'Pure PoS Consensus', description: 'Instant finality and carbon-negative' }
      ],
      isAlgorand: true
    };
  });
}

/**
 * Fetches and converts Algorand kingdoms for display
 */
export async function fetchAlgorandKingdoms(): Promise<AlgorandKingdom[]> {
  try {
    console.log('🌐 Fetching Algorand kingdoms...');
    const { activeKingdomIds } = await fetchActiveKingdomIds();
    const kingdoms = createAlgorandKingdoms(activeKingdomIds);
    console.log('🏰 Created Algorand kingdoms:', kingdoms);
    return kingdoms;
  } catch (error) {
    console.error('❌ Error fetching Algorand kingdoms:', error);
    return [];
  }
}