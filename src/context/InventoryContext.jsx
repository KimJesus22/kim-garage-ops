import { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('garage-inventory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('garage-inventory', JSON.stringify(inventory));
    }, [inventory]);

    const addPart = (part) => {
        setInventory(prev => [...prev, { ...part, id: Date.now() }]);
    };

    const updateStock = (id, change) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const newStock = Math.max(0, parseInt(item.stock) + change);
                return { ...item, stock: newStock };
            }
            return item;
        }));
    };

    const deletePart = (id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    };

    // --- Service Templates (Loadouts) System ---
    const [serviceTemplates, setServiceTemplates] = useState(() => {
        const saved = localStorage.getItem('garage-templates');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('garage-templates', JSON.stringify(serviceTemplates));
    }, [serviceTemplates]);

    const addTemplate = (template) => {
        setServiceTemplates(prev => [...prev, { ...template, id: Date.now() }]);
    };

    const deleteTemplate = (id) => {
        setServiceTemplates(prev => prev.filter(t => t.id !== id));
    };

    return (
        <InventoryContext.Provider value={{
            inventory,
            addPart,
            updateStock,
            deletePart,
            serviceTemplates,
            addTemplate,
            deleteTemplate
        }}>
            {children}
        </InventoryContext.Provider>
    );
};
