import Image from "next/image";

interface Step {
  number: number;
  title: string;
  description: string;
  image: string;
}

interface PreparationStepsProps {
  steps: Step[];
}

export function PreparationSteps({ steps }: PreparationStepsProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">Preparation Steps</h2>

      <div className="relative space-y-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex gap-6">
            <div className="flex flex-col items-center">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="mt-2 w-0.5 flex-1 bg-orange-200" />
              )}
            </div>

            <div className="flex-1 pb-8">
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              {step.image && (
                <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(min-width:768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
