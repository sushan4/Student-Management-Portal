import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { IconLogout, IconUser } from "@tabler/icons-react"

export function SiteHeader() {
  const { username, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Student Management Portal</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconUser className="h-4 w-4" />
            <span>Welcome, {username}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="cursor-pointer">
            <IconLogout className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
