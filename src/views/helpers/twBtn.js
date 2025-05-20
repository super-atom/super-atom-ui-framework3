// https://www.tailwind-variants.org/docs/introduction
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'btn',
  variants: {
    type: {
      primary: 'btn-type-primary',
      secondary: 'btn-type-secondary',
      point: 'btn-type-point',
    },
    size: {
      xs: 'btn-size-xs',
      sm: 'btn-size-sm',
      md: 'btn-size-md',
      lg: 'btn-size-lg',
    },
  },
});

export default function (type, size) {
  return button({ type, size });
}
