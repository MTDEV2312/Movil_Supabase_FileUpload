import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonLabel } from '@ionic/angular/standalone';
import { UploadfilesService } from '../../services/uploadfiles.service';
import { supabase } from '../../supabase.client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonInput, IonLabel]
})
export class FilesPage implements OnInit {

  selectedFile: File | null = null;
  uploadedFileUrl: string | null = null;
  readonly BUCKET_NAME = 'uploads'; // Define tu bucket aquí

  constructor(private uploadService: UploadfilesService, private router: Router) { }

  ngOnInit() {
  }

  // Captura el archivo seleccionado por el usuario
  onFileSelectedChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadedFileUrl = null; // Resetea la URL si se selecciona un nuevo archivo
    }
  }

  // Sube el archivo seleccionado a Supabase Storage
  async uploadSelectedFile() {
    if (!this.selectedFile) {
      alert('Por favor, selecciona un archivo primero.');
      return;
    }
    try {
      alert(`Subiendo ${this.selectedFile.name}...`);
      this.uploadedFileUrl = await this.uploadService.uploadFile(this.selectedFile, "uploads");
      alert('¡Archivo subido con éxito!');
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo. Revisa la consola para más detalles.');
      this.uploadedFileUrl = null; 
    }
  }

  // Guarda la información del archivo subido en la base de datos
  async saveUploadedFileInfo() {
    if (!this.selectedFile || !this.uploadedFileUrl) {
      alert('Por favor, sube un archivo antes de guardar su información.');
      return;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error al obtener la sesión:', sessionError);
      alert('Error al obtener la información del usuario. Por favor, intenta de nuevo.');
      return;
    }

    if (!session || !session.user) {
      alert('No hay un usuario autenticado. Por favor, inicia sesión.');
    
      this.router.navigate(['/auth']);
      return;
    }

    const userId = session.user.id;

    if (!userId) {
        alert('No se pudo obtener el ID del usuario. Asegúrate de estar autenticado.');
        return;
    }

    try {
      await this.uploadService.saveFileInfo(
        this.selectedFile.name,
        this.uploadedFileUrl,
        this.selectedFile.type,
        this.selectedFile.size,
        this.BUCKET_NAME,
        userId
      );
      
      this.selectedFile = null;
      this.uploadedFileUrl = null;
    } catch (error) {
      console.error('Error al guardar la información del archivo:', error);
      alert('Error al guardar la información del archivo. Revisa la consola para más detalles.');
    }
  }


}
