import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const InventoryContext = createContext();

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Supabase Operations ---

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inventory')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setInventory(data || []);
        } catch (error) {
            console.error('Error fetching inventory:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load & Auth Listener
    useEffect(() => {
        fetchInventory();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchInventory();
            } else {
                setInventory([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const addPart = async (part) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user');

            // Supabase generates the ID, so we don't need to pass it if the DB is set up that way.
            // However, the user instruction said "Supabase genera el id", so we exclude it if present or let Supabase handle it.
            // We'll pass the part object directly but inject user_id.
            const { data, error } = await supabase
                .from('inventory')
                .insert([{ ...part, user_id: user.id }])
                .select();

            if (error) throw error;

            // Optimistic update or re-fetch. Re-fetching is safer for ID sync.
            // But to be fast, we can append if we get the data back.
            if (data) {
                setInventory(prev => [...prev, ...data]);
            }
        } catch (error) {
            console.error('Error adding part:', error.message);
        }
    };

    const updateStock = async (id, change) => {
        try {
            // 1. Get current stock
            const { data: currentItem, error: fetchError } = await supabase
                .from('inventory')
                .select('stock')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            // 2. Calculate new stock
            const newStock = Math.max(0, (currentItem.stock || 0) + change);

            // 3. Update
            const { error: updateError } = await supabase
                .from('inventory')
                .update({ stock: newStock })
                .eq('id', id);

            if (updateError) throw updateError;

            // 4. Refresh local state
            setInventory(prev => prev.map(item =>
                item.id === id ? { ...item, stock: newStock } : item
            ));

        } catch (error) {
            console.error('Error updating stock:', error.message);
        }
    };

    const deletePart = async (id) => {
        try {
            const { error } = await supabase
                .from('inventory')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setInventory(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting part:', error.message);
        }
    };

    // --- Service Templates (Loadouts) System ---

    const [serviceTemplates, setServiceTemplates] = useState([]);

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('service_templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setServiceTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error.message);
        }
    };

    // Fetch templates on load
    useEffect(() => {
        fetchTemplates();
    }, []);

    const addTemplate = async (template) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user');

            const { data, error } = await supabase
                .from('service_templates')
                .insert([{
                    name: template.name,
                    labor_cost: template.laborCost,
                    items: template.items,
                    user_id: user.id
                }])
                .select()
                .single();

            if (error) throw error;

            setServiceTemplates(prev => [data, ...prev]);
        } catch (error) {
            console.error('Error adding template:', error.message);
        }
    };

    const deleteTemplate = async (id) => {
        try {
            const { error } = await supabase
                .from('service_templates')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setServiceTemplates(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting template:', error.message);
        }
    };

    return (
        <InventoryContext.Provider value={{
            inventory,
            loading,
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
