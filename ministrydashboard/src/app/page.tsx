'use client';

import React from 'react';
import TextInput from '../components/TextInput';
import CustomButton from '../components/CustomButton';
import CustomPasswordInput from '../components/CustomPasswordInput';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100 sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">Welcome</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Login to Your Account</h1>
            <p className="mt-2 text-sm text-gray-500">Use your credentials to continue.</p>
          </div>

          <form className="space-y-5">
            <TextInput
              label="Email"
              placeholder="Enter youremail"
              containerClassName="w-full"
            />

            <CustomPasswordInput
              label="Password"
              placeholder="Enter your password"
              containerClassName="w-full"
            />

            <div className="pt-2">
              <CustomButton type="primary" className="w-full h-11 text-base font-semibold">
                Login
              </CustomButton>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
