/**
 * @seal/ui — design-system barrel.
 *
 * Keep this file authoritative. Components that aren't exported here are
 * effectively invisible to the apps that consume the package.
 */

export { cn } from './cn';

// Primitives
export * from './Icon';
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Select, type SelectProps, type SelectOption } from './Select';
export { Textarea, type TextareaProps } from './Textarea';
export { Modal, type ModalProps } from './Modal';
export { Card } from './Card';
export { Stat, type StatProps } from './Stat';
export { Logo } from './Logo';

// Layout + structure
export { Section, type SectionProps } from './Section';
export { Nav, type NavProps, type NavLink } from './Nav';
export { Footer, type FooterProps, type FooterOffice, type FooterColumn } from './Footer';
export { SectionHeading, type SectionHeadingProps } from './SectionHeading';

// Hero + editorial
export { Hero, type HeroProps } from './Hero';
export { CinematicHero, type CinematicHeroProps } from './CinematicHero';
export { EditorialFeature, type EditorialFeatureProps } from './EditorialFeature';
export { AirplaneScene } from './AirplaneScene';
export { RouteMap } from './RouteMap';

// Process + pricing + people
export { Timeline, type TimelineProps, type TimelineStep } from './Timeline';
export { PricingTable, type PricingTableProps, type PricingRow } from './PricingTable';
export { CountryGrid, type CountryGridProps, type CountryEntry } from './CountryGrid';
export { TestimonialCard, type TestimonialCardProps, type Testimonial } from './TestimonialCard';

// Motion
export {
  MotionFadeUp,
  type MotionFadeUpProps,
  MotionStagger,
  type MotionStaggerProps,
  MotionParallax,
  type MotionParallaxProps,
  AnimatedImage,
  type AnimatedImageProps,
} from './MotionPrimitives';
export * as motionPresets from './motion-presets';

// Tokens (runtime — for charts, JSON-LD, theming non-Tailwind surfaces)
export * as tokens from './tokens';
