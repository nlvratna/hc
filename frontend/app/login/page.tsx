import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Link
              href="/"
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input id="password" type="password" />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full">Login</Button>
          <div className="text-sm text-center">
            Don't have an account?
            <Link href="/signup" className="text-green-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
