import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

import { InputFieldComponent } from '../../form/input/input-field.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { LabelComponent } from '../../form/label/label.component';
import { ModalComponent } from '../../ui/modal/modal.component';

@Component({
  selector: 'app-user-info-card',
  imports: [
    InputFieldComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent
],
  templateUrl: './user-info-card.component.html',
  styles: ``
})
export class UserInfoCardComponent {

  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  user = {
    firstName: 'Administrador',
    lastName: 'SIGRA',
    social: {
      facebook: '#',
      x: '#',
      linkedin: '#',
      instagram: '#',
    },
    email: 'info@gmail.com',
    phone: '+58 412 328 87 76',
    bio: 'Administrador',
  };

  handleSave() {
    // Handle save logic here
    console.log('Saving changes...');
    this.modal.closeModal();
  }
}
