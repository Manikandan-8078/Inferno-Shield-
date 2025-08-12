
'use client';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Shield, Home, History, Settings, MessageSquare, LogOut, User, Lightbulb, Siren } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/emergency-lights', label: 'Emergency Lights', icon: Lightbulb },
  { href: '/alarms', label: 'Alarms', icon: Siren },
  { href: '/incidents', label: 'Incidents', icon: History },
  { href: '/messaging', label: 'Messaging', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="group flex min-h-screen w-full" data-variant="sidebar">
        <Sidebar>
          <SidebarHeader className="group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 transition-all duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-sidebar-accent">
                    <Shield className="text-primary size-8" />
                    <div className="flex flex-col">
                      <h1 className="text-xl font-semibold">Inferno Shield</h1>
                      <p className="text-sm text-muted-foreground">Admin</p>
                    </div>
                  </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="user avatar" />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@inferno.shield
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" asChild>
                  <Link href="/login">
                    <LogOut />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className='flex-1'>
                <h1 className="text-lg font-semibold capitalize">
                {pathname.substring(1).split('/')[0].replace('-', ' ') || 'Dashboard'}
                </h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
