import { z } from 'zod';

const baseSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = baseSchema
  .extend({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .transform(data => {
    // Combine firstName and lastName into name for database compatibility
    return {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
    };
  });

export const signInSchema = baseSchema;

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;

export type userAuthData = SignUpData | SignInData;
