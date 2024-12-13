import { ProfileHeader } from "@/components/ui/ProfileHeader";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  


  return (
    <div className="block space-x-4 p-4 w-full">
      <ProfileHeader />
      {children}
    </div>
  );
}
