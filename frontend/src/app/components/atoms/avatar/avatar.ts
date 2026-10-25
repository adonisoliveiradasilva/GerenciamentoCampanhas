import { CommonModule } from '@angular/common';
import { Component, input, ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  selector: 'lumen-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  initials = input<string>(''); 
  
  label = input<string>(''); 

  imageUrl = input<string | null | undefined>(null);
  size = input<'small' | 'medium' | 'larger' | 'xlarge'>('medium');
  shape = input<'squircle' | 'circle'>('squircle');
  imageFit = input<'cover' | 'contain'>('cover');

  public imageError = signal<boolean>(false);

  public displayInitials = computed(() => {
      const manualInitials = this.initials();
      if (manualInitials) return manualInitials;

      const fullText = this.label();
      if (!fullText) return '';

      const cleanText = fullText.trim();
      const words = cleanText.split(/\s+/);

      if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
      }
      
      return cleanText.substring(0, 2).toUpperCase();
  });

  public onImageError(): void {
      this.imageError.set(true);
  }
}