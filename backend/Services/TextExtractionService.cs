using UglyToad.PdfPig;

namespace NeuroMentor.Api.Services;

public class TextExtractionService
{
    public string Extract(Stream stream, string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();

        return ext switch
        {
            ".pdf" => ExtractPdf(stream),
            ".txt" or ".md" => new StreamReader(stream).ReadToEnd(),
            _ => new StreamReader(stream).ReadToEnd()
        };
    }

    private static string ExtractPdf(Stream stream)
    {
        using var ms = new MemoryStream();
        stream.CopyTo(ms);
        ms.Position = 0;

        using var pdf = PdfDocument.Open(ms.ToArray());
        var sb = new System.Text.StringBuilder();
        foreach (var page in pdf.GetPages())
            sb.AppendLine(page.Text);

        return sb.ToString();
    }
}
