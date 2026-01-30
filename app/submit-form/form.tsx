"use client";

import { useForm } from "@tanstack/react-form";
import * as React from "react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
    onSubmit: async () => {
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
                        onBlur={field.handleBlur}
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
                        onBlur={field.handleBlur}
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
                        onBlur={field.handleBlur}
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
                        onValueChange={(value) =>
                          field.handleChange(value === "yes")
                        }
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
                        onValueChange={field.handleChange}
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
