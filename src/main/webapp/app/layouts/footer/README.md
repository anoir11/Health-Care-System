# MediLink Footer — Angular Component

## Files

```
src/app/
├── footer/
│   ├── footer.component.ts       ← Component logic & data
│   ├── footer.component.html     ← Template
│   └── footer.component.scss     ← Styles
└── pipes/
    └── safe-html.pipe.ts         ← Required for SVG innerHTML
```

## Usage

### 1. Copy the files into your project

### 2. Add to your layout (e.g. app.component.html)

```html
<app-footer></app-footer>
```

### 3. Import in your app or parent module

```ts
// In app.component.ts (standalone)
import { FooterComponent } from './footer/footer.component';

@Component({
  imports: [FooterComponent],
  ...
})
```

### 4. Add Google Fonts to index.html (if not already)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```

### 5. Hook up the booking action

In `footer.component.ts`, replace the `onBookAppointment()` console.log with your router navigation:

```ts
import { Router } from '@angular/router';

constructor(private router: Router) {}

onBookAppointment(): void {
  this.router.navigate(['/book']);
}
```

### 6. Hook up the newsletter subscription

Replace `onSubscribe()` with your service call:

```ts
constructor(private newsletterService: NewsletterService) {}

onSubscribe(): void {
  if (!this.email) return;
  this.newsletterService.subscribe(this.email).subscribe(() => {
    this.email = '';
  });
}
```

## Dependencies

- Angular 17+ (standalone components)
- `@angular/forms` (for ngModel)
- `@angular/platform-browser` (for DomSanitizer in SafeHtmlPipe)
