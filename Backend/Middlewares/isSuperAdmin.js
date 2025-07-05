const isSuperAdmin = (req, res, next) => {
    try {
        const { role } = req.user
        if (!req.user || !role) {
            return res.status(401).json({ message: "Unauthorized. User data not found." });
        }
        if (role !== 'superAdmin') {
            return res.status(403).json({ message: "Access denied. You are not a super admin." });
        }
        next();
    } catch (error) {
        console.error("Error in isSuperAdmin middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = isSuperAdmin;