'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronDown, X } from 'lucide-react'

export interface AutocompleteOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface AutocompleteProps {
  value: string
  onValueChange: (value: string) => void
  options: AutocompleteOption[]
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
  maxHeight?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function Autocomplete({
  value,
  onValueChange,
  options,
  placeholder = "Search...",
  emptyMessage = "No results found.",
  className,
  disabled = false,
  clearable = true,
  maxHeight = "300px",
  onFocus,
  onBlur,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
    option.description?.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find(option => option.value === selectedValue)
    if (selectedOption) {
      setInputValue(selectedOption.label)
      onValueChange(selectedValue)
    }
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setOpen(true)
    
    // If the input matches an option exactly, select it
    const exactMatch = options.find(option => 
      option.label.toLowerCase() === newValue.toLowerCase()
    )
    if (exactMatch) {
      onValueChange(exactMatch.value)
    } else {
      onValueChange(newValue)
    }
  }

  const handleClear = () => {
    setInputValue('')
    onValueChange('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              setOpen(true)
              onFocus?.()
            }}
            onBlur={() => {
              // Delay to allow for option selection
              setTimeout(() => {
                setOpen(false)
                onBlur?.()
              }, 200)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-10"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {clearable && inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
        style={{ maxHeight }}
      >
        <Command>
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className="flex items-center gap-2 py-2 px-3 cursor-pointer"
                  >
                    {option.icon && (
                      <span className="flex-shrink-0">
                        {option.icon}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}