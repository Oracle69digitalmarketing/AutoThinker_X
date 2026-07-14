import pptxgen from "pptxgenjs";
import { Blueprint } from '../../../types';
import { BaseGenerator, ExportOptions } from './BaseGenerator';

export class PitchDeckGenerator extends BaseGenerator {
  async generate(blueprint: Blueprint, options?: ExportOptions): Promise<Blob> {
    const pres = new pptxgen();
    const color = this.getBrandingColor(blueprint.branding);

    // Title Slide
    const titleSlide = pres.addSlide();
    titleSlide.background = { color: "0f172a" }; // slate-900
    titleSlide.addText(blueprint.name, {
      x: 1, y: 1.5, w: 8, h: 1,
      fontSize: 44, color: "ffffff", bold: true, align: "center"
    });
    titleSlide.addText(blueprint.tagline, {
      x: 1, y: 2.5, w: 8, h: 1,
      fontSize: 24, color: color.replace('#', ''), align: "center"
    });

    // Problem Slide
    const problemSlide = pres.addSlide();
    problemSlide.addText("THE PROBLEM", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: color.replace('#', '') });
    problemSlide.addText(blueprint.overview.problem, { x: 0.5, y: 1.5, w: 9, h: 3, fontSize: 20 });

    // Solution Slide
    const solutionSlide = pres.addSlide();
    solutionSlide.addText("THE SOLUTION", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: color.replace('#', '') });
    solutionSlide.addText(blueprint.overview.solution, { x: 0.5, y: 1.5, w: 9, h: 3, fontSize: 20 });

    const blob = await pres.write({ outputType: "blob" }) as Blob;
    return blob;
  }
}
