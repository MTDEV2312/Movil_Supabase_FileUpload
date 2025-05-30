import {createClient} from '@supabase/supabase-js'
import {environment} from '../environments/environment';

export const supabase = createClient(environment.supaURL, environment.supaKey);