import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

@Component({
  selector: 'app-search-bar',
  imports: [NgIcon, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  viewProviders: [provideIcons({ lucideSearch })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  control = input.required<FormControl<string | null>>();
  placeholder = input('Search');
}
