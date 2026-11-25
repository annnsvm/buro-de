import type { FormFieldProps } from '@/types/components/ui/FormField.type';

/**
 * A labelled field with room kept underneath for whatever it may have to say.
 *
 * The message used to be positioned absolutely, pinned a few pixels below the field and
 * therefore growing *upwards*. That worked only for as long as every message fitted on one
 * line: the moment one wrapped - which the Ukrainian wordings do, being longer than the
 * English ones they replaced - its second line climbed over the input and sat on top of the
 * text being typed.
 *
 * So the message is in the normal flow now and can only ever push downwards. The space for
 * it is held open whether or not there is one, which is what the absolute positioning was
 * really for: without that, a form jumps every time a message appears or goes away.
 */
const FormField = ({ label, name, error, children, className }: FormFieldProps) => {
  return (
    <div className={`relative flex w-full flex-col ${className ?? ''}`}>
      {label ? (
        <label htmlFor={name} className="mb-2">
          {label}
        </label>
      ) : null}
      {children}
      <p
        {...(error ? { id: `${name}-error`, role: 'alert' as const } : {})}
        className="mt-1 min-h-5 px-3 text-sm text-[var(--color-error)]"
      >
        {error ?? ''}
      </p>
    </div>
  );
};

export default FormField;
