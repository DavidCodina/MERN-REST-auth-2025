// const defaultProps: Partial<NumberInputProps> = {
//   step: 1,
//   clampBehavior: 'blur',
//   allowDecimal: true,
//   allowNegative: true,
//   startValue: 0
// }

///////////////////////////////////////////////////////////////////////////
//
// Differences in behavior:
//
//   Typing -.0 into Mantine will immediately convert it to 0.
//   Typing  .0 will convert it to 0.
//   This is okay because it forces the user to use 0.xxx syntax.
//
//   Mantine's NumberInput's value can be string | number
//
///////////////////////////////////////////////////////////////////////////

/* ========================================================================

======================================================================== */
//! I have some concern here about using e.key.
//! For example, before edge 79 it won't work.
//! This means that it's not really supported prior to 2018,
//! and definitely not supported in IE11.

//# All field controls need to also be controlled if one wants.
//# At present we are probably allowing value/onChange to pass through
//# which could be problematic because the formattedValue state is not
//# set up to sync with the external value. This is true of all of the
//# components!

//# Add step. This should be done after the controls are implemented.

//# Add formatting : prefix/suffix

//# Bonus: rightSection / leftSection ???

//# Bonus: Increment / Decrement Controls
// By default, the right section is occupied by increment and decrement buttons.
// To hide them, set hideControls prop. You can also use rightSection prop to render
// anything in the right section to replace the default controls.

//# Bonus: Custom increment and decrement controls

//# What is mt prop.
