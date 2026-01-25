"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [binary, setBinary] = useState("");
  const [decimal, setDecimal] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleBinaryChange = (value: string) => {
    // Only allow 0s and 1s
    if (value === "" || /^[01]+$/.test(value)) {
      setBinary(value);
      setError("");
      
      if (value === "") {
        setDecimal(null);
      } else {
        try {
          const decimalValue = parseInt(value, 2);
          setDecimal(decimalValue);
        } catch (err) {
          setError("Invalid binary number");
          setDecimal(null);
        }
      }
    } else {
      setError("Only 0s and 1s are allowed");
    }
  };

  const handleClear = () => {
    setBinary("");
    setDecimal(null);
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Binary to Decimal Converter</CardTitle>
          <CardDescription className="text-lg">
            Enter a binary number (0s and 1s) to convert it to decimal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="binary-input" className="text-base font-medium">
              Binary Number
            </label>
            <Input
              id="binary-input"
              type="text"
              placeholder="e.g., 1010"
              value={binary}
              onChange={(e) => handleBinaryChange(e.target.value)}
              className={`text-lg h-12 ${error ? "border-destructive" : ""}`}
            />
            {error && (
              <p className="text-base text-destructive">{error}</p>
            )}
          </div>

          {decimal !== null && !error && (
            <div className="space-y-3">
              <label className="text-base font-medium">Decimal Result</label>
              <div className="rounded-md border border-border bg-muted p-6">
                <p className="text-4xl font-bold text-foreground">{decimal.toLocaleString()}</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full h-12 text-base"
            disabled={!binary && decimal === null}
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
