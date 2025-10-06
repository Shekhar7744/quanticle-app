const isLocal = window.location.hostname === 'localhost';

export const FUNCTION_URL = isLocal
  ? 'http://localhost:5001/quanticle-51638/us-central1/simulationExplain'
  : 'https://us-central1-quanticle-51638.cloudfunctions.net/simulationExplain';