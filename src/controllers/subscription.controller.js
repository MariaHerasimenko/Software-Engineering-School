const service = require("../services/subscription.service");

exports.subscribe = async (req, res) => {
  try {
    const { email, city, frequency } = req.body;

    if (!email || !city || !frequency) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await service.subscribe(email, city, frequency);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.confirm = async (req, res) => {
    try {
      const { token } = req.params;
  
      const result = await service.confirm(token);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.unsubscribe = async (req, res) => {
    try {
      const { token } = req.params;
  
      const result = await service.unsubscribe(token);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  