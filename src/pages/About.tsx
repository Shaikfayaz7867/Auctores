import React from 'react';
import { 
  BookOpen, GraduationCap, Scale, 
  ShieldAlert, Award, CheckCircle2, Eye, Target
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

export const About = () => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 flex flex-col gap-8 font-sans">
      
      {/* Page Header */}
      <div className="text-center flex flex-col gap-3">
        <Badge variant="secondary" className="mx-auto">Academic Publisher</Badge>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About Auctores
        </h1>
      </div>

      {/* WHO WE ARE */}
      <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#8B0000] to-red-700 flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">WHO WE ARE</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-primary pl-4">
            Auctores Publishers have been established with portfolio of enhancing high impact scientific and medical information with open access and internationally peer-reviewed process disseminating the updated knowledge in a broad spectrum of Science, Technical and Medical frontiers.
          </p>
        </CardContent>
      </Card>

      {/* Our Aim, Mission, Vision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg mb-4">
            <Target className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-3">Our Aim</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            To create an international venue for researchers from all walks of life to share and exchange their findings in order to push the boundaries of current knowledge.
          </p>
        </Card>
        
        <Card variant="glass" className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#8B0000] to-red-700 flex items-center justify-center shadow-lg mb-4">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-3">Our Mission</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Auctores mission is to play a prominent role in global research by publishing the high standard quality articles and convey all scientists, researchers, academics to publish their research work and make it impact globally. Auctores scrupulously emphasis on the advancement of knowledge in critical areas through the delivery of innovative information. We continuously search to make noteworthy assets that will serve research and technical community.
          </p>
        </Card>
        
        <Card variant="glass" className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg mb-4">
            <Eye className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-3">Our Vision</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            To be recognized globally as a promoter in the scientific community and to be a correspondent in expanding the boundaries of know-how.
          </p>
        </Card>
      </div>

      {/* Open Access Publishing */}
      <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Open Access Publishing</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-primary pl-4">
            Since Open Access publishing allows the permanent restoration of scientific data through digital copies, other than the constraint of Internet access, scientists around the world can freely share information and collaborate to enhance the growth of science. We are passionate about working with the global academic community to promote open scholarly research to the world.
          </p>
        </CardContent>
      </Card>

      {/* Publication Ethics */}
      <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#8B0000] to-red-700 flex items-center justify-center shadow-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Publication Ethics</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Publication of an article in a peer-reviewed journal is a main building block in the development of an intelligible and respected network of knowledge. It's reflecting the quality of the work of the authors and the publishers.
          </p>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Auctores publishing LLC follows principles of publication led by the Committee on Publication Ethics (COPE). Editors should be accountable for everything published in their journals. Editors' decisions to accept or reject a paper for publication should be based on the paper's importance, originality and clarity, and the study's validity and its relevance to the remit of the journal. We suppose our authors to obey with, best practice in publication ethics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Misconduct, Plagiarism Check */}
      <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Misconduct, Plagiarism Check</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Authors should present their results clearly and without fabrication, falsification or inappropriate data manipulation. Duplication of a published article with another published article is not acceptable. When this is identified we will consider publishing a notice of redundant publication. The research being reported should have been conducted in responsible and an ethical manner.
          </p>
          <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-xl border border-red-200 dark:border-red-900/50 mt-2">
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              Auctores refuse to publish any article that is found to have been plagiarised in any way. We encourage fresh and original work that adds value to our publication and are always on the lookout for a scholar who can be relied on to provide such work.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Editorial Assessment and Peer Review Process */}
      <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Editorial Assessment and Peer Review Process</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Scholarly peer review in scientific journals is a quality control mechanism, where an author's scholarly work, research, or ideas are subjected to a critical evaluation undertaken by experts specializing in the related area, prior to publication in a journal or as a book.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">We only publish articles that have been approved by highly qualified researchers with expertise in a field appropriate for the article.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">All Journals of Auctores Publishing LLC follow a rapid thorough double blind peer review system through electronic submission, assignment and communication.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">The details of neither author nor reviewer are disclosed to each other. The manuscripts submitted will be subjected to an unbiased primary screening to determine if the manuscript fits into the scope of the journal.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">The peer review process ensures that the articles published, meet the accepted standards of the discipline.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">Auctores follows an initial editorial review process (pre-quality editorial assessment-PQA), where the experts first assess the manuscript for their overall quality and suitability for publication in the journal; based on this system of evaluation, manuscripts are then accepted or rejected, followed by a double-blinded peer review process.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copy Rights */}
      <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#8B0000] to-red-700 flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Copy Rights</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Submission of a manuscript implies that the work described has not been published and authors retain ownership of the copyright of their articles.
          </p>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Auctores Publishing LLC is licensed under the terms of the Creative Commons Attribution License
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Policy */}
      <Card variant="glass" className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Payment Policy</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            In Open access Publication, the readers will have the free access to the published articles. It provides unrestricted usage of the published data by anyone with proper citation of the article. So, in open access the authors are charged the cost of production of full text, pdf and digital articles and permanent maintenance of digital archives.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The processing charges include editorial and peer review cost, journal publishing, website hosting and administrative costs.
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 mt-2">
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              The submitted author is responsible for the payment of Article Processing Charge. However fee discounts, waivers will be provided to the authors from middle and low income nations. The waiver is also applicable when the institution covers the charge under membership scheme.
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">The author must agree the payment policy while submitting the article and make the payment once the article is accepted for publication.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">We encourage authors who cannot afford to pay the processing charges to explain the reason and apply for a waiver during the submission.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300">The author will be notified to pay the processing charges only when the manuscript completes the peer review process and received editorial acceptance for publication. The article will be published online successfully only after the payment of publication charges.</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
