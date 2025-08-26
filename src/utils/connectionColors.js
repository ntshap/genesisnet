/**
 * Connection color mapping utility
 * Provides consistent colors for different connection types in the network visualization
 */

// Color mapping for connection labels
const connectionColorMap = {
  'Blockchain': '#8B5CF6', // Purple for blockchain
  'Data Request': '#3B82F6', // Blue for data requests
  'Data Supply': '#10B981', // Green for data supply
  'Auth': '#F59E0B', // Amber for auth
  'Discovery': '#EC4899', // Pink for discovery
  'Reputation': '#EF4444', // Red for reputation
  'Match': '#6366F1', // Indigo for match
  'Monitor': '#14B8A6', // Teal for monitor
  'Identity': '#F97316', // Orange for identity
  'Store': '#8B5CF6', // Purple for store
  'Process': '#06B6D4', // Cyan for process
  'Validate': '#EF4444', // Red for validate
  'Pay': '#10B981', // Green for payments
};

/**
 * Get color for a connection based on its label
 * @param {string} label - The connection label
 * @param {string} fallbackColor - Fallback color if no match is found
 * @returns {string} - The hex color code
 */
export const getConnectionColor = (label, fallbackColor = '#2d3748') => {
  return connectionColorMap[label] || fallbackColor;
};

export default getConnectionColor;
