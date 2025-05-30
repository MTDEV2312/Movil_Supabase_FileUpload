import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';



@Injectable({
  providedIn: 'root'
})
export class UploadfilesService {

  constructor() { }

  async uploadFile(file: File,bucket:string){
    const {data,error} = await supabase.storage.from(bucket).upload(`public/${file.name}`,file,{
      cacheControl: '3600',
        upsert: false
    });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    const {data: publicUrlData} = supabase.storage.from(bucket).getPublicUrl(`public/${file.name}`);

    return publicUrlData.publicUrl;
  }

  async saveFileInfo(fileName: string, fileUrl: string, mimeType: string, size: number, bucket: string, userId: string){
    const {data, error} = await supabase.from('archivos').insert([{
      nombre_archivo: fileName,
        ruta: `public/${fileName}`,
        url_publica: fileUrl,
        tipo_mime: mimeType,
        tamano_bytes: size,
        bucket: bucket,
        usuario_id: userId
    }]);
    if (error) {
      console.error('Error saving file info:', error);
      throw error;
    }else{
      alert('File info saved successfully!');
    }
  }
}
