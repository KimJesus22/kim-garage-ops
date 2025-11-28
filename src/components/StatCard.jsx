const StatCard = ({ title, value, icon: Icon, trend, variant = 'default' }) => {
    const variantStyles = {
        default: 'border-cod-border hover:border-cod-border-light',
        success: 'border-neon-green/30 hover:border-neon-green/50',
        warning: 'border-cod-orange/30 hover:border-cod-orange/50',
    };

    const iconColors = {
        default: 'text-cod-text-dim',
        success: 'text-neon-green',
        warning: 'text-cod-orange',
    };

    return (
        <div className={`card-cod ${variantStyles[variant]}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs text-cod-text-dim uppercase tracking-wider mb-2">
                        {title}
                    </p>
                    <p className="text-3xl font-display font-bold text-cod-text mb-1">
                        {value}
                    </p>
                    {trend && (
                        <p className={`text-xs ${trend.positive ? 'text-neon-green' : 'text-cod-orange'}`}>
                            {trend.text}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-sm bg-cod-darker ${iconColors[variant]}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
