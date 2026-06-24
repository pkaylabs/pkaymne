import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  RotateCcw,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { DASHBOARD } from "@/constants/page-path";
import { apiRequest, loginWithPassword, storeApiSession } from "@/lib/api/client";

type AuthMode = "login" | "signup";
type LoginView = "login" | "forgot-email" | "forgot-otp" | "forgot-reset" | "forgot-done";
type AuthModalsProps = {
  mode: AuthMode | null;
  onClose: () => void;
  onSwitch: (mode: AuthMode) => void;
};

const plans = [
  {
    name: "Starter",
    price: "$149",
    period: "/month",
    description: "For small agencies managing focused projects.",
    features: ["3 projects", "25 indicators", "10 users", "2,000 submissions/month"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$399",
    period: "/month",
    description: "For institutions running multiple programmes.",
    features: ["15 projects", "250 indicators", "50 users", "25,000 submissions/month"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For national programmes and complex donor reporting.",
    features: ["Unlimited workspaces", "Advanced controls", "Dedicated success", "Custom hosting options"],
    highlighted: false,
  },
];

function GoogleMark() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-bold text-blue-600 shadow-sm">
      G
    </span>
  );
}

export default function AuthModals({ mode, onClose, onSwitch }: AuthModalsProps) {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("Professional");
  const [loginView, setLoginView] = useState<LoginView>("login");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const activePlan = useMemo(
    () => plans.find((plan) => plan.name === selectedPlan) ?? plans[1],
    [selectedPlan]
  );

  const close = () => {
    setStep(1);
    setLoginView("login");
    setOtp("");
    onClose();
  };

  const switchMode = (nextMode: AuthMode) => {
    setStep(1);
    setLoginView("login");
    onSwitch(nextMode);
  };

  return (
    <AnimatePresence>
      {mode && (
        <Dialog open onClose={close} className="relative z-50">
          <DialogBackdrop
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
          />
          <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white text-slate-950 shadow-2xl"
            >
              <div className="grid max-h-[90vh] overflow-y-auto lg:grid-cols-[0.85fr_1.15fr]">
                <aside className="hidden bg-slate-950 p-8 text-white lg:block">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-sm text-blue-200">
                        Secure SaaS onboarding
                      </div>
                      <h2 className="mt-8 text-3xl font-bold">
                        {mode === "login" ? "Welcome back to your M&E workspace." : "Create your institution workspace."}
                      </h2>
                      <p className="mt-4 text-sm leading-6 text-slate-300">
                        Manage programmes, teams, indicators, field forms, submissions, and reports from one tenant-safe platform.
                      </p>
                    </div>
                    <div className="space-y-4">
                      {["Google auth ready", "Tenant data boundaries", "Audit-ready workflows"].map((item) => (
                        <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                          <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                <section className="relative p-6 sm:p-8">
                  <button
                    onClick={close}
                    className="absolute right-5 top-5 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {mode === "login" ? (
                    <LoginPanel
                      view={loginView}
                      setView={setLoginView}
                      resetEmail={resetEmail}
                      setResetEmail={setResetEmail}
                      otp={otp}
                      setOtp={setOtp}
                      passwordVisible={passwordVisible}
                      setPasswordVisible={setPasswordVisible}
                      newPasswordVisible={newPasswordVisible}
                      setNewPasswordVisible={setNewPasswordVisible}
                      confirmPasswordVisible={confirmPasswordVisible}
                      setConfirmPasswordVisible={setConfirmPasswordVisible}
                      onSwitch={() => switchMode("signup")}
                    />
                  ) : (
                    <SignupPanel
                      step={step}
                      setStep={setStep}
                      selectedPlan={selectedPlan}
                      setSelectedPlan={setSelectedPlan}
                      activePlan={activePlan}
                      passwordVisible={passwordVisible}
                      setPasswordVisible={setPasswordVisible}
                      onSwitch={() => switchMode("login")}
                    />
                  )}
                </section>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

function LoginPanel({
  view,
  setView,
  resetEmail,
  setResetEmail,
  otp,
  setOtp,
  passwordVisible,
  setPasswordVisible,
  newPasswordVisible,
  setNewPasswordVisible,
  confirmPasswordVisible,
  setConfirmPasswordVisible,
  onSwitch,
}: {
  view: LoginView;
  setView: (view: LoginView) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  passwordVisible: boolean;
  setPasswordVisible: (visible: boolean) => void;
  newPasswordVisible: boolean;
  setNewPasswordVisible: (visible: boolean) => void;
  confirmPasswordVisible: boolean;
  setConfirmPasswordVisible: (visible: boolean) => void;
  onSwitch: () => void;
}) {
  const [email, setEmail] = useState("admin@pkaymne.local");
  const [password, setPassword] = useState("Password123!");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      await loginWithPassword(email, password);
      window.location.assign(DASHBOARD);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendOtp = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await apiRequest<{ debug_otp?: string; message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail }),
      });
      if (response.debug_otp) setOtp(response.debug_otp);
      setMessage(response.debug_otp ? `Prototype OTP: ${response.debug_otp}` : response.message);
      setView("forgot-otp");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await apiRequest<{ reset_token: string }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail, otp }),
      });
      setResetToken(response.reset_token);
      setView("forgot-reset");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ reset_token: resetToken, password: newPassword }),
      });
      setView("forgot-done");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (view === "forgot-done") {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-3xl font-bold">Password updated</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your password reset has been simulated successfully. You can now sign in with the new password.
        </p>
        <button
          onClick={() => setView("login")}
          className="mt-8 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
        >
          Return to login
        </button>
      </div>
    );
  }

  if (view !== "login") {
    return (
      <div className="mx-auto max-w-md py-8">
        <button onClick={() => setView("login")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>
        <h2 className="text-3xl font-bold">Reset password</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {view === "forgot-email" && "Enter your email and we will simulate sending a one-time password."}
          {view === "forgot-otp" && `Enter the OTP sent to ${resetEmail || "your email"}. Use any 6 digits for this prototype.`}
          {view === "forgot-reset" && "Create a new password for your account."}
        </p>

        {view === "forgot-email" && (
          <div className="mt-8 space-y-5">
            <PasswordlessEmail value={resetEmail} onChange={setResetEmail} />
            <button disabled={isSubmitting || !resetEmail} onClick={sendOtp} className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400">
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {view === "forgot-otp" && (
          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Verification code</span>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none transition focus:border-blue-500"
                placeholder="000000"
              />
            </label>
            <button disabled={isSubmitting || otp.length < 6} onClick={verifyOtp} className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400">
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            <button className="mx-auto flex items-center gap-2 text-sm font-semibold text-blue-600">
              <RotateCcw className="h-4 w-4" />
              Resend code
            </button>
          </div>
        )}

        {view === "forgot-reset" && (
          <div className="mt-8 space-y-5">
            <PasswordField
              label="New password"
              visible={newPasswordVisible}
              onToggle={() => setNewPasswordVisible(!newPasswordVisible)}
              placeholder="Create new password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <PasswordField
              label="Confirm password"
              visible={confirmPasswordVisible}
              onToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <button disabled={isSubmitting || !resetToken} onClick={resetPassword} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
              {isSubmitting ? "Resetting..." : "Reset password"}
            </button>
          </div>
        )}
        {message && <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <h2 className="text-3xl font-bold">Sign in</h2>
      <p className="mt-2 text-sm text-slate-600">Access your institution dashboard and reporting workspace.</p>
      <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:bg-slate-50">
        <GoogleMark />
        Continue with Google
      </button>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or use email
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="space-y-4">
        <PasswordlessEmail value={email} onChange={setEmail} />
        <PasswordField
          label="Password"
          visible={passwordVisible}
          onToggle={() => setPasswordVisible(!passwordVisible)}
          placeholder="Enter password"
          value={password}
          onChange={setPassword}
        />
      </div>
      <div className="mt-6 flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
          Remember me
        </label>
        <button onClick={() => setView("forgot-email")} className="font-semibold text-blue-600">
          Forgot password?
        </button>
      </div>
      {message && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
      <button
        onClick={signIn}
        disabled={isSubmitting}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Signing in..." : "Continue to dashboard"}
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-6 text-center text-sm text-slate-600">
        New to PKay M&E?{" "}
        <button className="font-semibold text-blue-600" onClick={onSwitch}>
          Create an account
        </button>
      </p>
    </div>
  );
}

function SignupPanel({
  step,
  setStep,
  selectedPlan,
  setSelectedPlan,
  activePlan,
  passwordVisible,
  setPasswordVisible,
  onSwitch,
}: {
  step: number;
  setStep: (step: number) => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  activePlan: (typeof plans)[number];
  passwordVisible: boolean;
  setPasswordVisible: (visible: boolean) => void;
  onSwitch: () => void;
}) {
  const [organizationName, setOrganizationName] = useState("PKay Demo Institution");
  const [name, setName] = useState("Workspace Owner");
  const [email, setEmail] = useState(`owner.${Date.now()}@pkaymne.local`);
  const [password, setPassword] = useState("Password123!");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const planIds: Record<string, number> = { Starter: 1, Professional: 2, Enterprise: 3 };

  const completeSignup = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const session = await apiRequest<{
        access_token: string;
        refresh_token?: string | null;
        user?: { role?: string };
      }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          organization_name: organizationName,
          name,
          email,
          password,
        }),
      });
      storeApiSession(session);
      await apiRequest("/payments/paystack/initialize", {
        method: "POST",
        token: session.access_token,
        body: JSON.stringify({
          plan_id: planIds[selectedPlan],
          metadata: { selected_plan: selectedPlan, source: "signup_wizard" },
        }),
      });
      window.location.assign(DASHBOARD);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to complete signup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="pr-10">
        <h2 className="text-3xl font-bold">Start your subscription</h2>
        <p className="mt-2 text-sm text-slate-600">Set up your institution, choose a plan, then proceed to payment.</p>
      </div>

      <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:bg-slate-50">
        <GoogleMark />
        Continue signup with Google
      </button>

      <div className="mt-6 flex gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className={`h-2 flex-1 rounded-full ${item <= step ? "bg-blue-600" : "bg-slate-200"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Institution name</span>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
              <UserRound className="h-5 w-5 text-slate-400" />
              <input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} className="w-full outline-none" placeholder="Ministry, NGO, Agency" />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Your name</span>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
              <UserRound className="h-5 w-5 text-slate-400" />
              <input value={name} onChange={(event) => setName(event.target.value)} className="w-full outline-none" placeholder="Your full name" />
            </div>
          </label>
          <div className="sm:col-span-2">
            <PasswordlessEmail value={email} onChange={setEmail} label="Work email" placeholder="you@institution.org" />
          </div>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Primary programme focus</span>
            <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
              <option>Government programme monitoring</option>
              <option>NGO and donor-funded projects</option>
              <option>Institutional performance management</option>
              <option>Research and evaluation practice</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <PasswordField
              label="Create password"
              visible={passwordVisible}
              onToggle={() => setPasswordVisible(!passwordVisible)}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={setPassword}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <button
              key={plan.name}
              onClick={() => setSelectedPlan(plan.name)}
              className={`rounded-2xl border p-5 text-left transition ${
                selectedPlan === plan.name ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.highlighted && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Popular</span>}
              </div>
              <p className="mt-3 text-2xl font-bold">
                {plan.price}
                <span className="text-sm font-medium text-slate-500">{plan.period}</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
              <div className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Card number</span>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
                <CreditCard className="h-5 w-5 text-slate-400" />
                <input className="w-full outline-none" placeholder="4242 4242 4242 4242" />
              </div>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="MM/YY" />
              <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="CVC" />
            </div>
            <p className="text-xs leading-5 text-slate-500">
              Payment processing is represented here as a polished checkout step. Live billing will connect to the final provider when subscriptions are activated.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-5">
            <p className="text-sm text-slate-500">Selected plan</p>
            <h3 className="mt-2 text-2xl font-bold">{activePlan.name}</h3>
            <p className="mt-1 text-slate-600">
              {activePlan.price}
              {activePlan.period}
            </p>
            <div className="mt-5 space-y-2">
              {activePlan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button onClick={() => (step === 1 ? onSwitch() : setStep(step - 1))} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          {step === 1 ? "Sign in instead" : "Back"}
        </button>
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button disabled={isSubmitting} onClick={completeSignup} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
            {isSubmitting ? "Creating workspace..." : "Complete signup"}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
      {message && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
    </div>
  );
}

function PasswordlessEmail({
  value,
  onChange,
  label = "Email address",
  placeholder = "admin@institution.org",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
        <Mail className="h-5 w-5 text-slate-400" />
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full outline-none" placeholder={placeholder} type="email" />
      </div>
    </label>
  );
}

function PasswordField({
  label,
  visible,
  onToggle,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
        <LockKeyhole className="h-5 w-5 text-slate-400" />
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full outline-none" placeholder={placeholder} type={visible ? "text" : "password"} />
        <button type="button" onClick={onToggle} className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </label>
  );
}
