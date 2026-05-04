"use client";

import { useForm } from "@tanstack/react-form";
import * as React from "react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { getTracker } from "@/lib/analytics/tracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/language-context";

const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().min(8, "Phone number must be at least 8 characters."),
  hasAccount: z.boolean(),
  investAmount: z.string(),
});

export function ContactForm() {
  const { t } = useLanguage();
  const openedAtRef = React.useRef<number>(0);
  const firstInputAtRef = React.useRef<number | null>(null);
  const touchedFieldsRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    openedAtRef.current = Date.now();
    getTracker().event({ type: "form_open", name: "submit_form" });
    const touched = touchedFieldsRef.current;
    const opened = openedAtRef.current;
    return () => {
      // If the form was touched but not submitted, log abandonment with the
      // last-touched field as the bail-out point.
      if (touched.size > 0 && firstInputAtRef.current != null) {
        getTracker().event({
          type: "form_abandon",
          name: "submit_form",
          target: Array.from(touched).pop() || undefined,
          payload: {
            touchedFields: Array.from(touched),
            durationMs: Date.now() - opened,
          },
        });
      }
    };
  }, []);

  const onFieldFocus = React.useCallback((field: string) => {
    if (firstInputAtRef.current == null) {
      firstInputAtRef.current = Date.now();
      getTracker().event({
        type: "form_first_input",
        name: "submit_form",
        target: field,
        value: String(firstInputAtRef.current - openedAtRef.current),
      });
    }
    touchedFieldsRef.current.add(field);
    getTracker().event({
      type: "form_field_focus",
      name: "submit_form",
      target: field,
    });
  }, []);

  const onFieldBlur = React.useCallback((field: string, hasValue: boolean) => {
    getTracker().event({
      type: "form_field_blur",
      name: "submit_form",
      target: field,
      value: hasValue ? "filled" : "empty",
    });
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      hasAccount: false,
      investAmount: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const elapsed = Date.now() - openedAtRef.current;
      getTracker().event({
        type: "form_submit_attempt",
        name: "submit_form",
        value: String(elapsed),
      });
      try {
        const res = await fetch("/api/form-submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (res.ok) {
          getTracker().event({
            type: "form_submit_success",
            name: "submit_form",
            value: String(elapsed),
            payload: { hasAccount: value.hasAccount, investAmount: value.investAmount },
          });
          // Clear so unmount doesn't fire abandon.
          touchedFieldsRef.current.clear();
          firstInputAtRef.current = null;
          toast(t("submitform.success"), {
            position: "bottom-right",
            classNames: {
              content: "flex flex-col gap-2",
            },
            style: {
              "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
          });
          form.reset();
        } else {
          getTracker().event({
            type: "form_submit_error",
            name: "submit_form",
            value: String(res.status),
          });
          toast.error("Failed to submit form. Please try again.");
        }
      } catch {
        getTracker().event({
          type: "form_submit_error",
          name: "submit_form",
          value: "network",
        });
        toast.error("Failed to submit form. Please try again.");
      }
    },
  });

  return (
    <div className="section-container flex w-full justify-center mb-64">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>{t("submitform.title")}</CardTitle>
          <CardDescription>{t("submitform.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("submitting");
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t("Full Name")}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onFocus={() => onFieldFocus(field.name)}
                        onBlur={() => {
                          field.handleBlur();
                          onFieldBlur(field.name, !!field.state.value);
                        }}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={t("e.g John Doe")}
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t("Email Address")}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onFocus={() => onFieldFocus(field.name)}
                        onBlur={() => {
                          field.handleBlur();
                          onFieldBlur(field.name, !!field.state.value);
                        }}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g john@doe.com"
                        aria-invalid={isInvalid}
                      />

                      <FieldDescription>
                        {t("submitform.email.note")}
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t("Phone Number")}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onFocus={() => onFieldFocus(field.name)}
                        onBlur={() => {
                          field.handleBlur();
                          onFieldBlur(field.name, !!field.state.value);
                        }}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="e.g 99119911"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="hasAccount">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t("Do you have Tenger Capital account?")}
                      </FieldLabel>

                      <RadioGroup
                        value={field.state.value ? "yes" : "no"}
                        onValueChange={(value) => {
                          onFieldFocus(field.name);
                          field.handleChange(value === "yes");
                          onFieldBlur(field.name, true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="yes" id="r1" />
                          <Label htmlFor="r1">{t("Yes")}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="no" id="r2" />
                          <Label htmlFor="r2">{t("No")}</Label>
                        </div>
                      </RadioGroup>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="investAmount">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t("How much are you planning to invest?")}
                      </FieldLabel>

                      <RadioGroup
                        value={field.state.value}
                        onValueChange={(v) => {
                          onFieldFocus(field.name);
                          field.handleChange(v);
                          onFieldBlur(field.name, !!v);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            id="amount1"
                            value={t("submitform.amount1")}
                          />
                          <Label htmlFor="amount1">
                            {t("submitform.amount1")}
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            id="amount2"
                            value={t("submitform.amount2")}
                          />
                          <Label htmlFor="amount2">
                            {t("submitform.amount2")}
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            id="amount3"
                            value={t("submitform.amount3")}
                          />
                          <Label htmlFor="amount3">
                            {t("submitform.amount3")}
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            id="amount4"
                            value={t("submitform.amount4")}
                          />
                          <Label htmlFor="amount4">
                            {t("submitform.amount4")}
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            id="amount5"
                            value={t("submitform.amount5")}
                          />
                          <Label htmlFor="amount5">
                            {t("submitform.amount5")}
                          </Label>
                        </div>
                      </RadioGroup>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="self-end mt-8">
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              {t("Reset")}
            </Button>
            <Button type="submit" form="contact-form">
              {t("Submit")}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
