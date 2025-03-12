"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_COLLAPSED = "4rem"

type SidebarContext = {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultExpanded?: boolean
}

function SidebarProvider({ children, defaultExpanded = true }: SidebarProviderProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        mobileOpen,
        setMobileOpen,
      }}
    >
      <TooltipProvider delayDuration={0}>
        <div
          className="grid min-h-screen w-full"
          style={{
            gridTemplateColumns: expanded ? `${SIDEBAR_WIDTH} 1fr` : `${SIDEBAR_WIDTH_COLLAPSED} 1fr`,
            transition: "grid-template-columns 0.2s ease-in-out",
          }}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

function Sidebar({ className, ...props }: SidebarProps) {
  const { expanded, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      <aside className={cn("hidden h-screen border-r bg-background md:block", className)} {...props} />
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
          <div className="h-full bg-background">{props.children}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { setMobileOpen } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={cn("md:hidden", className)}
        onClick={() => setMobileOpen(true)}
        {...props}
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarToggle = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { expanded, setExpanded } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("hidden md:flex", className)}
        onClick={() => setExpanded(!expanded)}
        {...props}
      >
        <PanelLeft className={cn("h-5 w-5 transition-transform", expanded ? "" : "rotate-180")} />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    )
  },
)
SidebarToggle.displayName = "SidebarToggle"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex h-14 items-center border-b px-4", className)} {...props} />
  },
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex-1 overflow-auto py-2", className)} {...props} />
  },
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center border-t p-4", className)} {...props} />
  },
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon: React.ReactNode
    title: string
    isActive?: boolean
    isCollapsible?: boolean
    asChild?: boolean
  }
>(({ className, icon, title, isActive, isCollapsible = true, asChild = false, ...props }, ref) => {
  const { expanded } = useSidebar()
  const Comp = asChild ? Slot : "div"

  if (!expanded && isCollapsible) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={ref}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md",
              isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
              className,
            )}
            {...props}
          >
            {icon}
          </Comp>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {title}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex h-10 items-center gap-4 rounded-md px-3",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {icon}
      {expanded && <span>{title}</span>}
    </Comp>
  )
})
SidebarItem.displayName = "SidebarItem"

const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
  }
>(({ className, title, ...props }, ref) => {
  const { expanded } = useSidebar()

  return (
    <div ref={ref} className={cn("py-2", className)}>
      {title && expanded && <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">{title}</h3>}
      <div className="space-y-1 px-2">{props.children}</div>
    </div>
  )
})
SidebarSection.displayName = "SidebarSection"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarSection,
  SidebarToggle,
  SidebarTrigger,
  useSidebar,
}

