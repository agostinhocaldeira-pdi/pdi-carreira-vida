/**
 * Storage Service - Centralized data persistence layer
 * 
 * HOW TO MIGRATE TO SUPABASE:
 * 
 * 1. Update StorageService.ts methods to use supabase client
 * 2. Replace localStorage calls with:
 *    - SELECT queries for get operations
 *    - INSERT/UPDATE queries for save operations
 * 3. Add user_id = auth.uid() filter to all queries
 * 4. Create corresponding tables in Supabase for each data type
 * 
 * Example migration for getDiario():
 * 
 * BEFORE (localStorage):
 *   getDiario(): DiarioEntry[] {
 *     return this.getItem<DiarioEntry[]>(STORAGE_KEYS.DIARIO, []);
 *   }
 * 
 * AFTER (Supabase):
 *   async getDiario(): Promise<DiarioEntry[]> {
 *     const { data, error } = await supabase
 *       .from('diario')
 *       .select('*')
 *       .order('data', { ascending: false });
 *     return data || [];
 *   }
 */

export { storageService, STORAGE_KEYS } from './StorageService';
