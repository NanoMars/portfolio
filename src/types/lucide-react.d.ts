declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  export const Mail: FC<LucideProps>;
}
