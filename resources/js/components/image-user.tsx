import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export default function ImageUser({ user }: { user: User }) {
  const getInitials = useInitials();

  // Store new image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm<{ image: File | null }>({
    image: null,
  });

  const imageUser: FormEventHandler = (e) => {
    e.preventDefault();

    if (!data.image) {
      console.error('No image selected!');
      return;
    }

    post(route('profile.updateImage'), {
      onSuccess: () => {
        setImagePreview(null);
        setData('image', null);
      },
      onError: (errors) => {
        console.error('Upload failed:', errors);
      },
    });
  };

  return (
    <div className="space-y-6">
      <HeadingSmall title="Profile Image" description="Upload your profile picture below" />

      <form onSubmit={imageUser} className="space-y-6">
        <div className="grid gap-2">
          {/* Image Preview Section */}
          {(user.image || imagePreview) ? (
            <section className="space-y-1">
              <div className="flex gap-3 mt-2">

                {user.image ? (
                  <img
                    src={user.image ? `/storage/${user.image}` : `/images/no_user.jpg`}
                    alt={`${user.name} image`}
                    className={`w-20 h-20 rounded-full object-cover transition-opacity duration-300 ${imagePreview ? 'opacity-30' : 'opacity-100'}`}
                  />
                ) : (
                  <div className={`w-20 h-20 flex items-center justify-center rounded-full bg-black/70 dark:bg-[#404040] text-lg text-white ${imagePreview ? 'opacity-30' : 'opacity-100'}`}>
                    {getInitials(user.name)}
                  </div>
                )}

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="New Profile Image"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>
            </section>
          ) : (
            <div className={`w-20 h-20 flex items-center justify-center rounded-full bg-black/70 dark:bg-[#404040] text-lg text-white ${imagePreview ? 'opacity-30' : 'opacity-100'}`}>
              {getInitials(user.name)}
            </div>
          )}

          {/* Upload & Save Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <Label className="cursor-pointer px-4 border transition hover:border-white p-3 rounded-lg" htmlFor="image">
              Select Image
            </Label>
            <Button variant="default" type="submit" disabled={processing || !data.image}>
              Upload
            </Button>
            <Button variant="destructive" type="button" disabled={processing || !data.image}
              onClick={() => {
                setImagePreview(null);
                setData('image', null);
              }}>
              Reset
            </Button>
          </div>

          {/* Hidden File Input */}
          <Input
            hidden
            id="image"
            name="image"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setData('image', file);
              setImagePreview(file ? URL.createObjectURL(file) : null);
            }}
          />

          {/* Error Handling */}
          <InputError message={errors.image} />
        </div>
      </form >
    </div >
  );
}
