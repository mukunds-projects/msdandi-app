import { supabase } from '@/lib/supabase';

export const apiKeyService = {
  async fetchApiKeys() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createApiKey(newKey) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateApiKey(id, updateData) {
    const { data, error } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteApiKey(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateLastUsed(id) {
    const { error } = await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
}; 