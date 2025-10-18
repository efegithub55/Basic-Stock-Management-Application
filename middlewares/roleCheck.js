exports.isAdmin = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Kimlik doğrulaması gerekli",
    });
  }

  if (user.isAdmin === 1) {
    return next();
  }

  if (req.session) {
    req.session.alert = {
      message: "Bu işlem için yetkiniz bulunmamaktadır.",
      type: "warning",
    };
  }
};

exports.isAdminOrSelf = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Kimlik doğrulaması gerekli",
      });
    }

    const requestedId = parseInt(req.params.id || req.params.user_id);
    if (!requestedId || isNaN(requestedId)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz kullanıcı id",
      });
    }

    if (currentUser.isAdmin === 1) {
      return next();
    }

    if (currentUser.id === requestedId) {
      return next();
    }

    if (req.session) {
      req.session.alert = {
        message: "Bu işlem için yetkiniz bulunmamaktadır.",
        type: "warning",
      };
    }

    return res.status(403).json({
      // 401 değil, 403 olmalı
      success: false,
      message: "Bu işlem için yetkiniz bulunmamaktadır.",
    });
  } catch (err) {
    console.error("isAdminOrSelf middleware hata:", err);
    return res.status(500).json({
      success: false,
      message: "Yetki kontrolü sırasında hata oluştu.",
    });
  }
};
