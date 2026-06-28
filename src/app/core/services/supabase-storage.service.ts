import { Service } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';

import { environment } from '@app/environments/environment';

@Service()
export class SupabaseStorageService {
  private readonly client: SupabaseClient = createClient(
    environment.supabase.url,
    environment.supabase.anonKey
  );

  uploadProfileImage(userId: number, file: File): Observable<string> {
    const fileExt = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    return from(
      this.client.storage
        .from(environment.supabase.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })
        .then(({ error }: { error: { message: string } | null }) => {
          if (error) throw new Error(error.message);

          return this.client.storage.from(environment.supabase.bucket).getPublicUrl(filePath).data
            .publicUrl;
        })
    );
  }
}
