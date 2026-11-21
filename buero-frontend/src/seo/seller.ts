/**
 * Who is selling, in one place.
 *
 * The law wants a seller in e-commerce to give free access to these details, and two pages
 * now show them: the payment page and the public offer. Holding them in one constant is what
 * stops the two from drifting apart - a registry number corrected on one page and not the
 * other is exactly the kind of error nobody notices until it matters.
 */
export const SELLER = {
  name: 'Самойлова Анна Геннадіївна',
  registry: '2011600000000064435',
  /**
   * The registered address, exactly as the registry extract spells it - including the
   * inverted street name, which is the registry's own form and not a typo.
   */
  address:
    'Україна, 61170, Харківська обл., місто Харків, вул. Павлова Академіка, будинок 134/16, квартира 332',
  email: 'burode452@gmail.com',
  phone: '+380634871127',
} as const;
