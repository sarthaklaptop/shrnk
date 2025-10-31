'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Check, Copy } from 'lucide-react';

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
}

export default function AccountSettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useProtectedRoute();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status]);

  useEffect(() => {
    if (userData) {
      setNameInput(userData.name || '');
    }
  }, [userData]);

  const copyUserId = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('User ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/account-settings');
      setUserData(response.data.data);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (nameInput.trim() === userData?.name) {
      toast.info('No changes to save');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.patch('/api/account-settings', { name: nameInput.trim() });
      setUserData(response.data.data);
      toast.success('Name updated successfully');
    } catch (error: any) {
      console.error('Error updating name:', error);
      toast.error(error.response?.data?.error || 'Failed to update name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axios.delete('/api/account-settings');
      toast.success('Account deleted successfully');
      // Sign out and redirect to home
      router.push('/api/auth/signout');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.error || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const isNameChanged = nameInput.trim() !== (userData?.name || '');

  if (status === 'loading' || isLoading) {
    return (
      <div className="bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2">
        <div className="w-4/5 my-4 flex flex-col mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full rounded-lg mt-2 border-[1px] border-gray-300 p-2">
      <div className="w-4/5 my-4 flex flex-col mx-auto space-y-6">
        <h1 className="font-bold text-2xl">Account Settings</h1>

        {/* User Name Section */}
        <div className="border-2 flex flex-col gap-4 rounded-lg p-4 space-y-3">
          <div className='flex flex-col gap-2'>
            <Label htmlFor="name" className="text-lg font-semibold">
                Your Name
            </Label>
            <Label htmlFor="name" className="text-sm text-zinc-500">
                This is your name on Shrnk
            </Label>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              id="name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="flex-1"
            />
            <Button
              onClick={handleSaveName}
              disabled={!isNameChanged || isSaving}
              className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Email Section */}
        <div className="border-2 flex flex-col gap-4 rounded-lg p-4 space-y-3">
          <div className='flex flex-col gap-2'>
            <Label htmlFor="email" className="text-lg font-semibold">
                Your Email
            </Label>
            <Label htmlFor="email" className="text-sm text-zinc-500">
                This is your email on Shrnk
            </Label>
          </div>

          <div className='flex flex-col gap-2'>
            <Input
                id="email"
                type="email"
                value={userData?.email || ''}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-sm text-zinc-500">
                Updating email option will come soon in next update
            </p>
          </div>
        </div>

        {/* User ID Section */}
        {/* <div className="border-2 flex flex-col gap-4 rounded-lg p-4 space-y-3">
          <div className='flex flex-col gap-2'>
            <Label htmlFor="userId" className="text-lg font-semibold">
                Your User Id
            </Label>
            <Label htmlFor="userId" className="text-sm text-zinc-500">
                This is your Unique User Id on Shrnk
            </Label>
          </div>
          <Input
            id="userId"
            type="text"
            value={userData?.id || ''}
            readOnly
            disabled
            className="bg-gray-100 cursor-not-allowed font-mono text-sm"
          />
        </div> */}
        {/* User ID Section */}
        <div className="border-2 flex flex-col gap-4 rounded-lg p-4 space-y-3">
        <div className='flex flex-col gap-2'>
            <Label htmlFor="userId" className="text-lg font-semibold">
            Your User Id
            </Label>
            <Label htmlFor="userId" className="text-sm text-zinc-500">
            This is your Unique User Id on Shrnk
            </Label>
        </div>

            <div className="flex gap-2 items-center">
                <Input
                    id="userId"
                    type="text"
                    value={userData?.id || ''}
                    readOnly
                    disabled
                    className="bg-gray-100 cursor-not-allowed font-mono text-sm flex-1"
                />
                <Button
                    onClick={() => copyUserId(userData?.id || '')}
                    disabled={!userData?.id}
                    className="px-3 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50"
                >
                    {copied ? <Check size={16} strokeWidth={2} aria-hidden="true" /> : <Copy size={16} strokeWidth={2} aria-hidden="true" />}
                </Button>
            </div>
        </div>
        {/* Delete Account Section */}
        <div className="border-2 border-red-300 flex flex-col gap-4 rounded-lg p-4 space-y-3">
          <div className='flex flex-col gap-2'>
            <Label className="text-lg font-semibold text-red-600">
                Delete Account
            </Label>
            <p className="text-sm text-zinc-600">
                Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-fit px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers. All your links and analytics
                  will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    handleDeleteAccount();
                  }}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200"
                >
                  Yes, delete my account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
