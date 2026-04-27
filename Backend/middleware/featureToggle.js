const featureToggle = (featureName) => {
  return (req, res, next) => {
    // We check process.env[featureName]. By default if it's 'false', we block.
    // If not set, we default to whatever you want, let's say true.
    const isEnabled = process.env[featureName] !== 'false';
    
    if (!isEnabled) {
      return res.status(403).json({
        error: "This feature is coming soon!",
        code: "FEATURE_DISABLED"
      });
    }
    next();
  };
};

module.exports = { featureToggle };
