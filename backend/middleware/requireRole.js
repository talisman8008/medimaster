/* eslint-env node */

/**
 * Role-based middleware factory
 * Usage: requireRole('receptionist', 'admin')
 * Must be used AFTER authMiddleware (needs req.user.role)
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. This action requires: ${allowedRoles.join(' or ')} role.`,
            });
        }

        next();
    };
};

module.exports = requireRole;
