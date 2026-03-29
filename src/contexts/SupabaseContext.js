import { createContext, useContext } from "react";
import { supabase } from "../lib/supabase";

const SupabaseContext = createContext(supabase);

export function SupabaseProvider({ children }) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  return useContext(SupabaseContext);
}
